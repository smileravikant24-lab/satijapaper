export function hasDeptAccess(u, cat){
  if (!u)                        return false;
  if (u.role === 'Admin')        return true;
  if (cat === 'Family')          return false;
  if (u.deptAccess.includes('All'))                  return true;
  if (cat === 'Support')                             return true;
  // Backward compat for renamed categories
  if (cat === 'Accounts'  && (u.deptAccess.includes('Finance')    || u.deptAccess.includes('HR')))         return true;
  if (cat === 'AdminMIS'  && (u.deptAccess.includes('Management') || u.deptAccess.includes('HR')))         return true;
  if (cat === 'Warehouse' &&  u.deptAccess.includes('Dispatch'))   return true;
  return u.deptAccess.includes(cat);
}

export function canAccessProc(u, item){
  if (!u)                                       return false;
  if (u.role === 'Admin')                       return true;
  if (u.processAccess && u.processAccess.length > 0)
    return u.processAccess.includes(item.name);
  return hasDeptAccess(u, item.cat);
}

export function canAccessLink(u, procName, linkType){
  if (!u)                                                return false;
  if (u.role === 'Admin')                                return true;
  if (u.linkAccess && u.linkAccess[procName] && u.linkAccess[procName].length > 0)
    return u.linkAccess[procName].includes(linkType);
  return true;
}
