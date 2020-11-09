---
title: Use what you sell, sell what you use
coverImage: /img/bluelib.jpg
date: '2020-05-07'
author: jmm
thread: jmm-story
---

Episode #7 of my story starting [here](/posts/20200304-my-first-paid-job).

In the early nineties, me and my business partner were still struggling with the issue that whatever revenue we generated with new applications, maintaining the preceding ones was eating too much into our margin. We had tried to approach many types of businesses but the process of building custom software for one business and expecting other similar businesses to adopt it didn't materialize, often because we always ended up being driven to be too specific to the initial customer. We tried one last thing, that we should probably have started much much earlier : selling the C libraries we made for ourselves.

I love the introductory line I wrote for the user manual :

> As everybody knows, the more you program, the more bugs you have. The solution is obvious: stop programming.

I've lived by these words ever since, except they still have led me to program pretty much every day over the last 30 years ! There is an important nuance, the goal is _not_ to reuse code as much as possible, the goal is to write as little code as possible. Move the complexity out of the way. To me, that's the main role of a good API, let the programmer write the most frequent cases in the simplest and clearest way. Then, when it gets complicated, well, it's complicated so that's fine : just keep the simple things simple.

The most useful thing in BlueLib, to that effect, was to code screens like if you were just printing them : placing a field was no different to printing a string. Then, inside the library, a whole lot of complication happened, dealing with users going from one field to another, using their mouse or a menu. All hidden, handled behind the scenes, with the programmer simply declaring what was on screen. With this approach we were managing to develop custom software, in C, faster than most who were using the ubiquitous 4GL's of the time !  And it got even better once I had converted the lot to C++, when _Turbo C++_ came out.

Borland France gave us a lot of encouragement, it looked like we were finally onto something when, unfortunately, we reached the point where we couldn't sensibly continue. I've often been too early, that one time I started too late. I rang a few companies, trying to sell the code, and one Parisian computer services company rang me back : _"no, sorry, we're not actually interested in your software. On the other hand, we'd be really keen to have you on board"_.  And that's how I left my beloved Antibes, to run after my destiny !

PS: writing this, I realise that most of my employment career has happened this way : with me trying to sell some beautiful piece of software I wrote...
