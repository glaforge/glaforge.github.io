---
title: "Also back to vi... MacVim actually"
date: 2012-08-09T00:00:00.000+02:00
tags: [geek]
---

Some of my friends are going back to vi like me, for instance Hibernate's [Emmanuel](http://emmanuelbernard.com/blog/2012/08/01/i-succumbed-to-the-cult-of-vi/) and IzPack's [Julien](http://log.julien.ponge.info/post/28914211607/tweaking-macvim). I also mentioned a few good links about that move on the French [Les Castcodeurs podcast](http://lescastcodeurs.com/2012/07/19/les-cast-codeurs-podcast-episode-62-rod-va-sur-l-ile-de-larry/). And to be precise, I'm using [MacVim](http://code.google.com/p/macvim/) on my MacBook Pro laptop, but also vim on the command-line.  

Emmanuel and Julien gave some good tips and links too, and like Julien, I'm going to show you my current `.vimrc` in case anyone's interested:  

```javascript
let mapleader = ","
let g:mapleader=","

if has("gui_running")
   color solarized
endif

set background=dark

set number

set expandtab
set shiftwidth=4
set tabstop=4
set smarttab

set ai "Auto indent
set si "Smart indent

set ruler

set hlsearch

set nocompatible

set bs=2

set autoread

set so=7

filetype on
filetype indent on
filetype plugin on

set guifont=Inconsolata:h16

autocmd! bufwritepost .vimrc source ~/.vimrc

syntax enable

au BufNewFile,BufRead *.gradle set filetype=groovy

function! RunGroovy()
    let gfname=@%
    botright new
    setlocal buftype=nofile bufhidden=wipe nobuflisted noswapfile nowrap
    let gtmpf = tempname()
    let gcmd = ':!groovy ' . gfname . ' > ' . gtmpf
    silent execute gcmd
    silent execute '0r ' . gtmpf
endfunction

map   :call RunGroovy()
nmap @ :NERDTree

```