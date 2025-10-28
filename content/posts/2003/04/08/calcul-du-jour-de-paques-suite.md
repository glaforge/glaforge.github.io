---
title: "Calcul du jour de Pâques (suite)"
date: 2003-04-08T00:00:00.000+02:00
tags: [french, geek]
---

Imaginons que nous souhaitons créer un calendrier. Bien ! Mais pour être encore plus sympathique, nous allons rajouter sur ce calendrier les **jours fériés**. Ce n'est pas un problème pour les dates fixes comme le 1er janvier ou le 11 novembre. Mais il existe d'autres jours fériés qui sont dits "**mobiles**". Dans de très nombreux pays occidentaux, la pluspart de ces jours fériés mobiles sont définis par rapport à la date du jour de Pâques. Or, il faut déjà connaître le jour de Pâques. Effectivement, nous allons donc nous intéresser au calcul du jours de Pâques, qui est une fête religieuse dont la date est définie relativement à une phase lunaire proche de l'équinoxe de printemps du 21 mars. Je vous épargnerai les détails, mais voici une petite classe que vous pourrez modifier à loisir pour calculer le jours de Pâques.  
  
Je vous épargne les détails de l'algorithme, car on peut le trouver sur Internet, mais au moins, vous en aurez une implémentation en Java !  

```java
public class EasterDefinition
{
    private static int alpha(int year)
    {
        if (year <= 1582)
            return 0;
        else if (year <= 1699)
            return 7;
        else if (year <= 1899)
            return 8;
        else if (year <= 2199)
            return 9;
        else
            return 10;
    }

    private static int beta(int year)
    {
        if (year <= 1582)
            return 0;
        else if (year <= 1699)
            return 4;
        else if (year <= 1799)
            return 3;
        else if (year <= 1899)
            return 2;
        else if (year <= 2099)
            return 1;
        else if (year <= 2199)
            return 0;
        else
            return 6;
    }

    private static int r1(int year)
    {
        return (19 * (year % 19) + 15 + alpha(year)) % 30;
    }

    /** 
     * Nombre de jours entre Pâques et le 21 mars.
     *
     * @param year l'année dont on souhaite connaître le jour de Pâques.
     * @return le nombre de jours.
     */
    private static int r(int year)
    {
        int r1m = r1(year);
        return r1m < 28 ? r1m : (r1m == 28 ? (year % 19 > 10 ? 27 : 28) : 28);
    }

    private static int t(int year)
    {
        return (2 * (year % 4) + 4 * (year % 7) + 6 * r(year) + 6 - beta(year)) % 7;
    }

    /**
     * Calcule le jour de Pâques pour une année donnée.
     *
     * @param year l'année dont on souhaite connaître le jour de Pâques.
     * @return le jour de Pâques.
     */
     public static void main(String[] args)
     {
         int year = 2003;
         int rm = r(year);
         int tm = t(year);

         int day = rm + tm <= 9 ? rm + tm + 22 : rm + tm - 9;
         int month = rm + tm <= 9 ? Calendar.MARCH : Calendar.APRIL;
     }
}
```