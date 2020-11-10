---
title: A rewrite takes about a quarter of the time
coverImage: /img/ip20.jpg
date: '2020-03-09'
author: jmm
thread: jmm-story
---

Episode #3 of my story starting [here](/posts/20200304-my-first-paid-job).

In the 80’s, my bread and butter was writing software that would print quotes+invoices and manage a leads+customer database. The word database, at the time, really covered ISAM files together with separate B-tree files mapping a key to a record number. To me, it feels a bit ironic that we’re back to reasoning in terms of key-value pairs with sometimes quite complex composite values, although it shouldn’t feel like that as performance was and still is dependent on the number of times you need to go fetch data (which equally applies whether you’re thinking RAM, SSD, HDD, LAN or Cloud (i.e. always)).

I wrote _ipdraw_ for an IP20 store, they are a german brand of furniture and most of that store’s business was in modular cabinets and bookcases. The complexity is that, in order to quote a project, you need to figure out the exact list of parts you’re going to need, the size of each board or piece of glass, the number of handles, hinges and screws, as well as the time it’s going to take to put it all together. The one trick that made the whole application possible was that a bookcase lies against a wall, it can be represented as a series of columns of various heights, each column described as a series of sections. It’s really a 2D problem, it is really a list of lists. We love lists ! This led to a user interface where operations on the layout where easy to understand, so much so that it could be done in front of the client, while discussing options. Impressively for the time, it could also show 3D views of the project and, again because of the almost 2D nature of the data, it was possible to efficiently sort every object and every face that made it. I remember being surprised myself that it could actually be done.

I wrote a first version in Turbo Pascal, that worked well enough for that store that I met with the French head of the franchise to discuss also making the software available to the rest of the stores. I was already thinking about ways to get the product translated in German… I felt the meeting went well, people liked the software and they wanted more, they wanted to be able to output on a plotter rather than a printer, and they also wanted to be able to quote projects larger than a wall, or not related to a wall at all (desks, meeting rooms, etc). This meeting was going to be the biggest business lesson in my _whole_ life…

I had no idea how to do the plotter thing (I knew proper Hidden Lines Removal was a non starter), but I had a decent idea about how to do the 3D in raster now that things were broken down into convex sections, so I went ahead and started _ipdraw 2.0_. Turbo C had come out, I had converted all the libraries I had written for Pascal, so I switched to C and rewrote everything. I often say _« a rewrite takes about a quarter of the time the original took »_, and that’s about how long it took. I often also say _« … but it will take pretty much exactly the same amount of Q&A »_, which did take about that long too… The cost of making software really isn’t so much in the writing of the code as it is in the ensuring it does what it should in all the bloody cases.

That version 2.0 was looking amazing plus, Moore’s law to the rescue, it ran exceptionally fast on the shiny new generation of PC’s… But let’s go back to that business lesson I was talking about. I had taken upon myself to do the development on my funds, hoping to sell the software by the dozen once it was ready, but every time I was thinking « this is _the_ version », there was a complaint about some special item in the catalog that could not be rendered. I think I finally realised this would never end when they required rounded corner desks… I had made a classic mistake: I was working for free and they were trying to make the most of it. Always make sure your client has a stake in the project, make sure that there is _both_ common interest and common risk.

The irony is that they did not really need all this rendering, the actual business need was the parts lists necessary to all quotes and invoices. I was focusing too much on the graphics side of it, and they did too… Around the same time, I was contracted by a kitchens store and when I had shown them _ipdraw_, they said _« that’s exactly what we need, except the graphics »_ : they had professional draftsmen who drew plans to drool for. This ended up being much better business, much better customer satisfaction and really good reuse of code…

::: metadata Historical metadata
Year: 1986
OS: MS-DOS
CPU: 8086 8/16bits,8MHz,1C1T
GPU: Hercules
RAM: 640KB Storage: 20MB
Connectivity: 360KB Floppy disks
Language: v1 Pascal; v2 C
:::
