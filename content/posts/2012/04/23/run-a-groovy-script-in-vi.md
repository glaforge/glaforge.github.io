---
title: "Run a Groovy script in Vi"
date: "2012-04-23T00:00:00.000+02:00"
tags: [groovy]
---

In the Vi vs Emacs war, I'm in the Vi camp. I'm using Vim on the command-line to quickly edit files, and I'm also using MacVim on my Mac as my text editor. When I'm not using an IDE or the Groovy Console, I also want to be able to edit and run my Groovy scripts in my text editor. It's not too difficult to run a Groovy script from Vi, you can simply do:

```vi
:!groovy %
```

You use the colon to enter the command mode, then use the bang to issue a shell command. Here, obviously, I'm going to run the groovy command. And I can then pass the script I'm editing as parameter thanks to the percent sign, which points at the current file in my buffer.  

The drawback is that the output is the command area, but I wanted to get the output in its own buffer. So I spent a bit of time to flesh out my Vi skills, and came up with a function to open a new scratch buffer and output the result of the script execution in that new buffer, with the following script that I added in my `.vimrc` configuration:

```javascript
// the function to run my groovy scripts 
function! RunGroovy() 
    // copy the current buffer file name in a variable 
    let gfname=@% 
    // open a new buffer in my window below 
    botright new 
    // define the buffer to be a mere scratch buffer not intended to be edited or saved 
    setlocal buftype=nofile bufhidden=wipe nobuflisted noswapfile nowrap 
    // create a temporaty file name to hold the output of the execution of my Groovy script 
    let gtmpf = tempname() 
    // define the command line to launch my Groovy script and retrieve its output in the temporary file 
    let gcmd = ':!groovy ' . gfname . ' > ' . gtmpf 
    // execute the groovy command 
    silent execute gcmd 
    // insert the content of the output from the temporary file in my buffer 
    silent execute '0r ' . gtmpf
endfunction   

// add F5 as the shortcut for executing my Groovy scripts 
map :call RunGroovy()
```

I'm definitely not a Vi expert, and this script can be improved greatly probably. But it's good enough for now. But I'm open to improvements if the Vi experts reading this blog want to join in and give me advice!