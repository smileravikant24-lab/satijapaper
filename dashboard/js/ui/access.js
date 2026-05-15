// ============================================================
// ACCESS CONTROL (pure functions)
// Decides what a user can see / open. No DOM. No Firebase.
// Easy to unit-test if we ever want to.
// ============================================================

/**
 * Can the user see processes from this category at all?
 */
export function hasDeptAccess(u, cat){
  if (!u)                        return false;
  if (u.role === 'Admin')        return true;
  if (cat === 'Family')          return false;
  if (u.deptAccess.includes('All'))                  return true;
  if (cat === 'Support' || cat === 'My System')      return true;
  return u.deptAccess.includes(cat);
}

/**
 * Can the user access this specific process?
 * If processAccess is set, it overrides deptAccess.
 */
export function canAccessProc(u, item){
  if (!u)                                       return false;
  if (u.role === 'Admin')                       return true;
  if (u.processAccess && u.processAccess.length > 0)
    return u.processAccess.includes(item.name);
  return hasDeptAccess(u, item.cat);
}

/**
 * Can the user open this specific link type within a process?
 * If linkAccess[procName] is set, only those are allowed.
 */
export function canAccessLink(u, procName, linkType){
  if (!u)                                                return false;
  if (u.role === 'Admin')                                return true;
  if (!canAccessProc(u, {name: procName, cat: ''}))      return false;
  if (u.linkAccess && u.linkAccess[procName] && u.linkAccess[procName].length > 0)
    return u.linkAccess[procName].includes(linkType);
  return true;
}
