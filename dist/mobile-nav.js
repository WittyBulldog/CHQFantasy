document.querySelectorAll('.nav').forEach(nav => {
  const toggle=nav.querySelector('.nav-toggle');
  const links=nav.querySelector('.navlinks');
  const groups=Array.from(nav.querySelectorAll('.nav-group'));
  if(!toggle||!links)return;
  const mobile=window.matchMedia('(max-width:900px)');
  const closeGroups=except=>groups.forEach(group=>{if(group!==except)group.open=false;});
  const setOpen=(open,restoreFocus=false)=>{
    nav.classList.toggle('nav-open',open);
    toggle.setAttribute('aria-expanded',String(open));
    toggle.setAttribute('aria-label',open?'Close navigation menu':'Open navigation menu');
    if(!open)closeGroups();
    else if(mobile.matches){const current=nav.querySelector('.nav-group.active-group');if(current)current.open=true;}
    if(restoreFocus)toggle.focus();
  };
  nav.classList.add('nav-enhanced');
  toggle.hidden=false;
  links.querySelector('.active-nav')?.setAttribute('aria-current','page');
  toggle.addEventListener('click',()=>setOpen(!nav.classList.contains('nav-open')));
  for(const group of groups){
    group.addEventListener('toggle',()=>{if(group.open)closeGroups(group);});
    group.querySelector('summary').addEventListener('keydown',event=>{
      if(!['ArrowDown','ArrowUp'].includes(event.key))return;
      event.preventDefault();closeGroups(group);group.open=true;
      const items=group.querySelectorAll('a');
      (event.key==='ArrowDown'?items[0]:items[items.length-1])?.focus();
    });
  }
  nav.addEventListener('keydown',event=>{
    if(event.key!=='Escape')return;
    const group=event.target.closest('.nav-group');
    if(group?.open){event.preventDefault();group.open=false;group.querySelector('summary').focus();}
    else if(mobile.matches&&nav.classList.contains('nav-open')){event.preventDefault();setOpen(false,true);}
  });
  links.addEventListener('click',event=>{
    if(!event.target.closest('a'))return;
    if(mobile.matches)setOpen(false);else closeGroups();
  });
  document.addEventListener('click',event=>{
    if(nav.contains(event.target))return;
    closeGroups();if(mobile.matches)setOpen(false);
  });
  document.addEventListener('focusin',event=>{
    closeGroups(event.target.closest('.nav-group'));
    if(!nav.contains(event.target)&&mobile.matches)setOpen(false);
  });
  mobile.addEventListener('change',()=>{
    const focusWouldHide=mobile.matches&&links.contains(document.activeElement);
    const focusWasOnToggle=document.activeElement===toggle;
    const focusedGroup=document.activeElement.closest?.('.nav-group');
    if(!mobile.matches&&focusedGroup?.open)focusedGroup.querySelector('summary').focus();
    setOpen(false,focusWouldHide);
    if(!mobile.matches&&focusWasOnToggle)(nav.querySelector('.active-group > summary')||links.querySelector('a')).focus();
  });
});
