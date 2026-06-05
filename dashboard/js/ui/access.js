export function canAccessProc(u, item){
  if (!u)                                       return false;
  if (u.role === 'Admin')                       return true;
  
  // Default allowed system categories for everyone
  if (item.cat === 'Support' || item.cat === 'My System') return true;

  // Strictly check Individual Process Access
  return u.processAccess?.includes(item.name) || false;
}

export function canAccessLink(u, procName, linkType){
  if (!u)                                                return false;
  if (u.role === 'Admin')                                return true;
  if (!canAccessProc(u, {name: procName, cat: ''}))      return false;
  if (u.linkAccess && u.linkAccess[procName] && u.linkAccess[procName].length > 0)
    return u.linkAccess[procName].includes(linkType);
  return true;
}
