export async function verify(c,task){
  if(!Number.isInteger(task.tabId)||!Number.isInteger(task.groupId)||!Number.isInteger(task.windowId))throw new Error('잘못된 작업 소유권 기록');
  const tab=await c.call('tabs','get',task.tabId);
  if(tab.groupId!==task.groupId||tab.windowId!==task.windowId)throw new Error('작업 탭의 그룹/창이 변경되어 중단합니다.');
  const tabs=await c.call('tabs','query',{groupId:task.groupId});
  if(tabs.length!==1||tabs[0].id!==task.tabId)throw new Error('그룹에 다른 탭이 있어 중단합니다.');
  return tab;
}
