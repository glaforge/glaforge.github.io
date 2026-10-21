---
title: "The eMudhra CA Compromise: Why Your JVM Is Vulnerable (and How to Fix It Properly)"
description: "Why browsers are already protected against the October 2026 eMudhra intermediate CA private key compromise while Java installations remain exposed, why deleting emSign from cacerts is not enough, and how to block all 16 compromised certificates via blocked.certs."
date: 2026-10-21T11:40:00+02:00
tags:
- java
- security
image: /img/java/emudhra-ca-compromise-jvm.jpg
---

On October 20, 2026, a major WebPKI security incident was publicly disclosed at [emudhra.we-have-a-problem.com](https://emudhra.we-have-a-problem.com/): the private keys of **eight intermediate Certificate Authorities (CAs)** operated by **eMudhra (emSign)** were compromised due to catastrophically weak entropy during their key generation ceremony in April 2025.

Because the private keys were generated with only a few bits of entropy, anyone can mathematically derive the private keys directly from the public certificates in milliseconds. With those private keys in hand, an attacker can forge cryptographically valid TLS or code-signing certificates for **any domain or software artifact**, enabling Machine-in-the-Middle (MitM) traffic interception and service impersonation.

If you open [emudhra.we-have-a-problem.com](https://emudhra.we-have-a-problem.com/) in Chrome, Firefox, Safari, or Edge today, your browser will report that 0 out of 12 connections succeeded: you are protected.

**Your Java installations, however, are almost certainly still vulnerable.**

In this article, we will look at why Java is uniquely exposed, how to test your JDKs with a single-file Java program created by Java Champion [Mark Struberg](https://github.com/struberg), why the `keytool` commands circulating online give a false sense of security, and how to properly block the compromised certificates across all your JDKs (OpenJDK, Eclipse Temurin, GraalVM, etc.).

---

## 1. Why Browsers Are Safe While Java Remains Exposed

Mainstream browsers and operating systems neutralized the threat within hours thanks to two mechanisms that **Java does not enable by default**:

1. **Out-of-band revocation push mechanisms**: Chrome (*CRLSets*), Firefox (*CRLite* / *OneCRL*), Apple, and Microsoft pushed emergency blocklists directly to client devices between October 17 and October 20.
2. **Certificate Transparency (CT) enforcement**: Modern browsers refuse to trust TLS certificates unless they are recorded in public CT logs (and no rogue certificates from these intermediates appeared in CT logs).

By contrast, **OpenJDK, Temurin, and GraalVM**:
- Rely on a static trust store bundled with each JDK (`$JAVA_HOME/lib/security/cacerts`).
- Do **not** enforce Certificate Transparency by default.
- Keep **OCSP and CRL revocation checking disabled by default** (`com.sun.net.ssl.checkRevocation=false`) for performance and availability reasons.

Until you either apply an out-of-band JDK security patch or update your JDK's security configuration yourself, any outbound HTTPS connection made by `HttpClient`, `HttpsURLConnection`, Spring `RestClient`/`WebClient`, Quarkus, Micronaut, Netty, or OkHttp using the default JVM trust store will accept forged certificates signed by the compromised eMudhra intermediates.

---

## 2. Testing Your JVM with `CheckCompromisedCa.java`

To make it easy for Java developers to verify whether their JVM accepts certificate chains signed by the compromised eMudhra intermediates, Java Champion [Mark Struberg](https://github.com/struberg) created the following self-contained Java class, `CheckCompromisedCa.java`.

Because it uses JEP 330 single-file source execution and the built-in `java.net.http.HttpClient`, you can run it directly with `java CheckCompromisedCa.java` on any JDK 11+:

```java
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.security.Security;
import java.time.Duration;
import javax.net.ssl.SSLException;

/**
 * Checks whether the JVM accepts a TLS chain that contains a compromised
 * intermediate CA. If the connection succeeds, the problem was not detected.
 *
 * Usage:
 *  java CheckCompromisedCa.java        (JVM defaults)
 *  java CheckCompromisedCa.java -r     (additionally enable OCSP/CRL revocation checks)
*/
public class CheckCompromisedCa {

    private static final String TEST_URLS[] = {
            "https://dv-g3b-emudhra.we-have-a-problem.com/",
            "https://dv-g3c-emudhra.we-have-a-problem.com/",
            "https://ov-g3b-emudhra.we-have-a-problem.com/",
            "https://ov-g3c-emudhra.we-have-a-problem.com/",
            "https://ev-g3b-emudhra.we-have-a-problem.com/",
            "https://ev-g3c-emudhra.we-have-a-problem.com/",
            "https://dv-g3b-aaa-emudhra.we-have-a-problem.com/",
            "https://dv-g3c-aaa-emudhra.we-have-a-problem.com/",
            "https://ov-g3b-aaa-emudhra.we-have-a-problem.com/",
            "https://ov-g3c-aaa-emudhra.we-have-a-problem.com/",
            "https://ev-g3b-aaa-emudhra.we-have-a-problem.com/",
            "https://ev-g3c-aaa-emudhra.we-have-a-problem.com/"
    };

    public static void main(String[] args) throws InterruptedException {
        if (args.length > 0 && args[0].equals("-r")) {
            // Must be set before the first TLS context is created
            Security.setProperty("ocsp.enable", "true");
            System.setProperty("com.sun.net.ssl.checkRevocation", "true");
            System.setProperty("com.sun.security.enableCRLDP", "true");
        }

        HttpClient client = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();

        for (String url : TEST_URLS) {
            verifyTLS(client, url);
        }
    }

    private static void verifyTLS(HttpClient client, String url) throws InterruptedException {
        HttpRequest request = HttpRequest.newBuilder(URI.create(url))
                .timeout(Duration.ofSeconds(15))
                .GET()
                .build();

        try {
            HttpResponse<Void> response = client.send(request, HttpResponse.BodyHandlers.discarding());
            // Handshake succeeded -> certificate chain was accepted
            System.out.println("VULNERABLE (HTTP " + response.statusCode() + ") " + url);
        } catch (IOException e) {
            SSLException ssl = findSslException(e);
            if (ssl != null) {
                // Handshake was rejected -> problem detected
                System.out.println("OK " + url);
                System.out.println("  " + ssl.getClass().getSimpleName() + ": " + ssl.getMessage());
                return;
            }
            // DNS, timeout, connection refused etc. -> says nothing about TLS
            System.out.println("ERROR: " + e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    // The HTTP client may wrap the SSL exception, so walk the cause chain
    private static SSLException findSslException(Throwable t) {
        while (t != null) {
            if (t instanceof SSLException) {
                return (SSLException) t;
            }
            t = t.getCause();
        }
        return null;
    }
}
```

When you run `java CheckCompromisedCa.java` on an unpatched JDK, all 12 connections succeed, meaning **your JVM trusts all 12 compromised chains**:

```text
VULNERABLE (HTTP 200) https://dv-g3b-emudhra.we-have-a-problem.com/
VULNERABLE (HTTP 200) https://dv-g3c-emudhra.we-have-a-problem.com/
VULNERABLE (HTTP 200) https://ov-g3b-emudhra.we-have-a-problem.com/
VULNERABLE (HTTP 200) https://ov-g3c-emudhra.we-have-a-problem.com/
VULNERABLE (HTTP 200) https://ev-g3b-emudhra.we-have-a-problem.com/
VULNERABLE (HTTP 200) https://ev-g3c-emudhra.we-have-a-problem.com/
VULNERABLE (HTTP 200) https://dv-g3b-aaa-emudhra.we-have-a-problem.com/
VULNERABLE (HTTP 200) https://dv-g3c-aaa-emudhra.we-have-a-problem.com/
VULNERABLE (HTTP 200) https://ov-g3b-aaa-emudhra.we-have-a-problem.com/
VULNERABLE (HTTP 200) https://ov-g3c-aaa-emudhra.we-have-a-problem.com/
VULNERABLE (HTTP 200) https://ev-g3b-aaa-emudhra.we-have-a-problem.com/
VULNERABLE (HTTP 200) https://ev-g3c-aaa-emudhra.we-have-a-problem.com/
```

---

## 3. Why Checking Only `emSign` in `cacerts` Is a Trap

Some security advisories (such as [PrivateDevOps](https://privatedevops.com/news/emudhra-ca-keys-leaked-updates)) suggest checking your Java trust store for `emSign` roots using `keytool`:

```bash
keytool -list -cacerts -storepass changeit -v | grep -i "Owner:.*emSign"
```

On a standard OpenJDK, Temurin, or GraalVM installation, this returns:

```text
Owner: CN=emSign ECC Root CA - G3, O=eMudhra Technologies Limited, OU=emSign PKI, C=IN
Owner: CN=emSign Root CA - G1, O=eMudhra Technologies Limited, OU=emSign PKI, C=IN
Owner: CN=emSign Root CA - G2, O=eMudhra Technologies Limited, OU=emSign PKI, C=IN
```

**Why is deleting `emSign` roots from `cacerts` not enough?**

Look closely at the second half of the URLs in `CheckCompromisedCa.java`: `*-aaa-emudhra.we-have-a-problem.com`.

Each of the 8 compromised intermediate CA keys (6 for TLS, 2 for Code Signing) was signed **twice**, creating **16 compromised intermediate CA certificates in total**:
1. **8 certificates** were issued by eMudhra's `emSign Root TLS CA - G3` and `emSign Root CS CA - G3` (which chain up to `emSign ECC Root CA - G3`, alias `emsigneccrootcag3 [jdk]`).
2. **8 cross-signed certificates** were issued by **Sectigo's `AAA Certificate Services`** root (alias `comodoaaaca [jdk]`).

In Mozilla NSS 3.131.1 and Python's `certifi`, `AAA Certificate Services` had *already* been removed from their TLS root stores earlier in 2026, so for them, removing `emSign ECC Root CA - G3` was sufficient.

**In Java's `cacerts`, however, `AAA Certificate Services` (`comodoaaaca [jdk]`) is still present and trusted!**
- If you only delete `emsigneccrootcag3` from `cacerts`, your JVM is **still 100% vulnerable** to the 6 `*-aaa-emudhra` TLS chains and 2 cross-signed code-signing chains.
- Conversely, if you delete `comodoaaaca` from `cacerts`, you distrust the entire Sectigo/Comodo `AAA Certificate Services` root hierarchy, which can break connections to legitimate legacy endpoints.

| Mitigation Approach | Blocks `*-emudhra` chains? | Blocks `*-aaa-emudhra` (Sectigo cross-sign) chains? | Collateral Damage |
| :--- | :---: | :---: | :--- |
| Delete `emsigneccrootcag3` from `cacerts` | ✅ Yes | ❌ **No (Still Vulnerable!)** | Distrusts all valid eMudhra G3 certs |
| Delete both `emsigneccrootcag3` & `comodoaaaca` from `cacerts` | ✅ Yes | ✅ Yes | Breaks legitimate servers chaining to Sectigo's `AAA Certificate Services` |
| **Add the 16 SHA-256 hashes to `$JAVA_HOME/lib/security/blocked.certs`** | ✅ **Yes** | ✅ **Yes** | **None** (surgically blocks only the 16 compromised intermediates) |

---

## 4. The Right Fix: `$JAVA_HOME/lib/security/blocked.certs`

OpenJDK has a built-in mechanism specifically designed to block compromised intermediate (or leaf/root) certificates without collateral damage to `cacerts`:

```text
$JAVA_HOME/lib/security/blocked.certs
```

Whenever the JVM validates a TLS or code-signing certificate chain (`sun.security.provider.certpath.UntrustedChecker` / `sun.security.util.UntrustedCertificates`), it computes the **SHA-256 fingerprint** of every certificate in the chain and checks whether it appears in `$JAVA_HOME/lib/security/blocked.certs`.

If any certificate in the chain matches, the JVM immediately aborts the handshake with:
`CertPathValidatorException: Untrusted certificate`.

### Blocking All 16 Compromised Intermediate CAs

Append the 16 SHA-256 fingerprints (from [`impacted-intermediates.json`](https://emudhra.we-have-a-problem.com/impacted-intermediates.json)) to `$JAVA_HOME/lib/security/blocked.certs`:

```bash
cat << 'EOF' >> "$JAVA_HOME/lib/security/blocked.certs"

# eMudhra compromised intermediate CAs (2026-10-20)
# EM DV TLS CA - G3B (issued by emSign Root TLS CA - G3)
42C4ACCD12C4F59597925E1A08A7A90102608543809308D50EC427E118BA1493
# EM DV TLS CA - G3B (issued by AAA Certificate Services)
45A883F349AEDFD5F3A649B5498FFB121712BA8B448F3F2A91DBC5A766FCDDBE
# EM OV TLS CA - G3B (issued by emSign Root TLS CA - G3)
98B896625C0C230ADEEC3EB2CF6AAD5001ECF9156A68644E82374CE5833BC25B
# EM OV TLS CA - G3B (issued by AAA Certificate Services)
5F1DED4DD590AF74631290CF073B122A2AAC6A1FA479778A0BD43579BD832699
# EM EV TLS CA - G3B (issued by emSign Root TLS CA - G3)
E7568FE6E12331F4FD7DE61DA4C7559D0F8EB192A218D4741A3BA75184333838
# EM EV TLS CA - G3B (issued by AAA Certificate Services)
579480AEA166290BD3C643589E795FC0D0E54E86505D180F1DFF99EFD3199512
# EM DV TLS CA - G3C (issued by emSign Root TLS CA - G3)
0164D7CEAE5BB909C272AF151FF44B1177AE9B47D9424B94F1D9558C30934D19
# EM DV TLS CA - G3C (issued by AAA Certificate Services)
62B7F9868263F72F6911FC78CEAF72C1979158B7368BF648683BB2AA39B02E72
# EM OV TLS CA - G3C (issued by emSign Root TLS CA - G3)
CB6E15165AC802E9B3F993F16C25D41F4E81C21EBDE71AE1B012AC00BF9C7C3F
# EM OV TLS CA - G3C (issued by AAA Certificate Services)
7485B51C0ED192878FA1D2F948FB529AE1842CC5086C4B67F7BE5B2039DE9489
# EM EV TLS CA - G3C (issued by emSign Root TLS CA - G3)
432EC25F0D28DE9006D97BF752F17BBB2CD41F669933FCB072D9A1148D0261F3
# EM EV TLS CA - G3C (issued by AAA Certificate Services)
FD9D5C2DBBD4995AB69B8D50C439D9527B00529199C2FD01B2174EB58F07021F
# EM OV CS CA - G3B (issued by emSign Root CS CA - G3)
9E39DE2881273ACC225A149C72BA3E0F51424963669AB633EE1DC7DF5DB067B4
# EM OV CS CA - G3B (issued by AAA Certificate Services)
A496E23AC0CAB8155FC9B117B97EAE368EFCBB9041AEC8804D5A308D2D01C2D8
# EM OV CS CA - G3C (issued by emSign Root CS CA - G3)
4B2460A466F95FD40113BCDCCA2CEB29B3B093921DE45474DA7DF48874C630B1
# EM OV CS CA - G3C (issued by AAA Certificate Services)
84112972B8E59D14560AE7E7119654474AAD119990CF3722BFC1E3B91615E1FD
EOF
```

### Patching All SDKMAN JDKs at Once

If you manage multiple JDK versions locally using [SDKMAN!](https://sdkman.io/), remember that each JDK has its own `lib/security/blocked.certs`. You can patch all of them in one go:

```bash
for jdk in ~/.sdkman/candidates/java/*/; do
  [[ "$(basename "$jdk")" == "current" ]] && continue
  blocked="$jdk/lib/security/blocked.certs"
  if [[ -f "$blocked" ]] && ! grep -q "42C4ACCD12C4F59597925E1A08A7A90102608543809308D50EC427E118BA1493" "$blocked"; then
    cp "$blocked" "$blocked.bak"
    cat << 'EOF' >> "$blocked"

# eMudhra compromised intermediate CAs (2026-10-20)
42C4ACCD12C4F59597925E1A08A7A90102608543809308D50EC427E118BA1493
45A883F349AEDFD5F3A649B5498FFB121712BA8B448F3F2A91DBC5A766FCDDBE
98B896625C0C230ADEEC3EB2CF6AAD5001ECF9156A68644E82374CE5833BC25B
5F1DED4DD590AF74631290CF073B122A2AAC6A1FA479778A0BD43579BD832699
E7568FE6E12331F4FD7DE61DA4C7559D0F8EB192A218D4741A3BA75184333838
579480AEA166290BD3C643589E795FC0D0E54E86505D180F1DFF99EFD3199512
0164D7CEAE5BB909C272AF151FF44B1177AE9B47D9424B94F1D9558C30934D19
62B7F9868263F72F6911FC78CEAF72C1979158B7368BF648683BB2AA39B02E72
CB6E15165AC802E9B3F993F16C25D41F4E81C21EBDE71AE1B012AC00BF9C7C3F
7485B51C0ED192878FA1D2F948FB529AE1842CC5086C4B67F7BE5B2039DE9489
432EC25F0D28DE9006D97BF752F17BBB2CD41F669933FCB072D9A1148D0261F3
FD9D5C2DBBD4995AB69B8D50C439D9527B00529199C2FD01B2174EB58F07021F
9E39DE2881273ACC225A149C72BA3E0F51424963669AB633EE1DC7DF5DB067B4
A496E23AC0CAB8155FC9B117B97EAE368EFCBB9041AEC8804D5A308D2D01C2D8
4B2460A466F95FD40113BCDCCA2CEB29B3B093921DE45474DA7DF48874C630B1
84112972B8E59D14560AE7E7119654474AAD119990CF3722BFC1E3B91615E1FD
EOF
    echo "Patched $(basename "$jdk")"
  fi
done
```

### Verifying the Fix

Re-run Mark Struberg's `CheckCompromisedCa.java` after updating `blocked.certs`:

```bash
java CheckCompromisedCa.java
```

Every single one of the 12 test URLs is now rejected during the TLS handshake:

```text
OK https://dv-g3b-emudhra.we-have-a-problem.com/
  SSLHandshakeException: (certificate_unknown) PKIX path validation failed: java.security.cert.CertPathValidatorException: Untrusted certificate: CN=EM DV TLS CA - G3B, O=eMudhra BV, C=NL
OK https://dv-g3c-emudhra.we-have-a-problem.com/
  SSLHandshakeException: (certificate_unknown) PKIX path validation failed: java.security.cert.CertPathValidatorException: Untrusted certificate: CN=EM DV TLS CA - G3C, O=eMudhra Inc, C=US
...
OK https://ev-g3c-aaa-emudhra.we-have-a-problem.com/
  SSLHandshakeException: (certificate_unknown) PKIX path validation failed: java.security.cert.CertPathValidatorException: Untrusted certificate: CN=EM EV TLS CA - G3C, O=eMudhra Inc, C=US
```

---

## 5. What About GraalVM Native Image and Containers?

- **GraalVM Native Image**: When you compile a Java application into a native binary with `native-image`, GraalVM embeds the security configuration and trust store from the host JDK **at build time**. Once you patch `$JAVA_HOME/lib/security/blocked.certs` in your GraalVM installation, **rebuild your native executables** so the updated blocklist is compiled into the binary.
- **Docker / OCI Containers**: Container images freeze the JDK trust store and `blocked.certs` at image build time. Until your base image vendor (Eclipse Temurin, Amazon Corretto, Azul Zulu, Oracle, Chainguard, etc.) ships an updated JDK build containing the new `blocked.certs` entries, add a `RUN` step in your `Dockerfile` to append the 16 hashes to `$JAVA_HOME/lib/security/blocked.certs` and redeploy your services.
