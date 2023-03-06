---
title: "Apache XML-RPC, côté client"
date: "2003-04-03T00:00:00.000+02:00"
tags: [french, geek, java]
---

Pour le fun, j'ai eu envie d'essayer l'[API XML-RPC de la fondation Apache](http://ws.apache.org/xmlrpc/). Pour être précis, je vouais expérimenter avec les APIs de Blogger et MetaWeblog qui permettent de mettre à jour les Weblogs à distance. Ce sont des APIs standardisées que la pluspart des Weblog comprennent.  
  
Ainsi, par exemple, l'outil de publication [w.Bloggar](http://wbloggar.com/) permet de éditer/modifier/créer des nouvelles entrées dans votre blog. Pour cela, il fait appel aux procédures distantes (Remote Procedure) du serveur hébergeant votre blog.  
  
Pour le cas qui m'intéresse, j'utilise chez mon hébergeur le Blog Nucleus. C'est un blog GPL, donc gratuit, avec toutes les fonctionnalités que l'on peut attendre d'un tel outil de publication (multi-weblog, interface d'administration, multi-utilisateur, ban IP, commentaires, plugin divers et variés, etc...)  
  
J'ai donc téléchargé l'API XML-RPC d'Apache, j'ai lancé mon IDE Java préféré ([IntelliJ IDEA](http://www.intellij.com/)), j'ai créé un nouveau projet avec une petite classe NucleusClient et sa méthode main() pour tester Nucleus et son support des APIs de weblogging...  
  
C'est déconcertant de facilité ! Vive XML-RPC ! Jugez-en par vous-même :  

```java
import org.apache.xmlrpc.XmlRpcClient;
import org.apache.xmlrpc.XmlRpcException;
import java.util.Vector;
import java.io.IOException;

public class NucleusClient
{
    public static void main(String[] args) throws IOException, XmlRpcException
    {
        XmlRpcClient rpcClient = 
            new XmlRpcClient("http://www.yourhost.com/weblog/nucleus/xmlrpc/server.php");

        Vector params = new Vector();
        params.addElement("1"); // blogId
        params.addElement("YourAccount");
        params.addElement("YourPassword");
        String result = (String)rpcClient.execute("metaWeblog.getPost", params);
        System.out.println("result = " + result);
  }
}
```

  
  
En quelques lignes, on appelle un Service Web (reposant sur XML-RPC). On utilise pour cela la classe XmlRpcClient à qui l'on passe l'URL du blog, on crée un vecteur contenant les paramètres de la méthode distante, et on execute la requête. Il ne reste plus qu'à récupérer le résultat !