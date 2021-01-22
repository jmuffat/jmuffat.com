---
title: Toujours des p'tits pots
coverImage: /img/pots-et-bac-2.jpg
date: '2020-11-27'
author: jmm
script: '~/components/blog/pots-et-bac/sim2'
thread: pots
locale: 'fr-FR'
---

Cette fois-ci, j'ai ajouté des méthodes qui tentent d'utiliser toute la surface
du bac, avec les lignes impaires qui touchent les deux bords (méthodes 4&5) ou
en ayant les lignes impaires qui touchent un côté et les lignes paires l'autre
(méthodes 6&7).

Il faudra que je vérifie, mais il me semble que les méthodes 2&3 sont des cas
particuliers des nouvelles méthodes et que je vais pouvoir les enlever.

Si l'on compare avec la page du [plus petit carré contenant n cercles](https://fr.wikipedia.org/wiki/Empilement_de_cercles_dans_un_carr%C3%A9), mes méthodes trouvent une bonne
partie des solutions. Pensez à diviser leurs largeurs de carré par deux pour les
utiliser ici : ils utilisent des cercles de _rayon_ 1 et j'utilise un _diamètre_
de 1. Il faut maintenant s'attaquer aux cas plus difficiles 7, 8, 10, 11...

L'espoir de trouver une formule qui donnerait le nombre optimal de pots qui
tiennent dans le bac s'amenuise mais l'espoir de trouver des formules pour
borner étroitement cette valeur s'amenuisent aussi : il me faut déjà considérer
diverses méthodes pour établir un minimum et je n'ai pas encore trouvé de
méthode satisfaisante pour calculer un nombre de pot dont on soit sûr qu'il ne
tiendra pas...

Je trouve ce genre de situation absolument fascinante !

###### Simul2
