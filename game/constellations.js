// 遊戲用星象示意圖。油畫與對照圖共用資料，位置不另加占星象徵規則。
const graph = (points, edges = points.slice(1).map((_, i) => [i, i + 1])) => ({ points, edges });
export const constellations = [
  { name: '牡羊座', symbol: '♈', graph: graph([[15,65],[40,42],[72,35],[85,47]]) },
  { name: '金牛座', symbol: '♉', graph: graph([[10,20],[34,42],[51,62],[72,40],[90,15],[45,82],[51,62]], [[0,1],[1,2],[2,3],[3,4],[2,5]]) },
  { name: '雙子座', symbol: '♊', graph: graph([[28,15],[22,48],[15,85],[72,15],[78,48],[85,85]], [[0,1],[1,2],[3,4],[4,5],[0,3],[1,4]]) },
  { name: '巨蟹座', symbol: '♋', graph: graph([[50,12],[48,42],[32,64],[18,88],[48,42],[73,66],[88,80]], [[0,1],[1,2],[2,3],[1,5],[5,6]]) },
  { name: '獅子座', symbol: '♌', graph: graph([[12,76],[33,46],[65,39],[76,17],[89,29],[83,48],[76,64],[75,82],[37,74]], [[0,1],[1,2],[2,3],[3,4],[4,5],[2,6],[6,7],[7,8],[8,0]]) },
  { name: '處女座', symbol: '♍', graph: graph([[17,16],[35,32],[55,43],[80,24],[55,43],[51,67],[76,84],[27,84]], [[0,1],[1,2],[2,3],[2,5],[5,6],[5,7]]) },
  { name: '天秤座', symbol: '♎', graph: graph([[18,37],[52,15],[83,38],[68,82],[30,80]], [[0,1],[1,2],[2,3],[3,4],[4,0],[0,2]]) },
  { name: '天蠍座', symbol: '♏', graph: graph([[86,12],[76,26],[64,32],[53,48],[44,69],[32,83],[16,80],[10,67],[18,58]]) },
  { name: '射手座', symbol: '♐', graph: graph([[14,64],[35,43],[66,44],[79,68],[58,82],[35,43],[44,17],[62,28]], [[0,1],[1,2],[2,3],[3,4],[4,1],[1,6],[6,7],[7,2]]) },
  { name: '摩羯座', symbol: '♑', graph: graph([[12,25],[30,72],[67,88],[89,35],[50,43]], [[0,1],[1,2],[2,3],[3,4],[4,0]]) },
  { name: '水瓶座', symbol: '♒', graph: graph([[10,28],[30,43],[49,25],[68,44],[89,25],[68,44],[56,68],[35,86]], [[0,1],[1,2],[2,3],[3,4],[3,6],[6,7]]) },
  { name: '雙魚座', symbol: '♓', graph: graph([[8,26],[22,13],[36,29],[22,41],[8,26],[54,57],[73,84],[91,70],[77,54]], [[0,1],[1,2],[2,3],[3,0],[3,5],[5,6],[6,7],[7,8],[8,5]]) }
];

export function drawGraph(canvas, data) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  const point = index => { const [x,y] = data.points[index]; return [w * (.08 + x * .0084), h * (.08 + y * .0084)]; };
  ctx.strokeStyle = '#a3f4ff'; ctx.lineWidth = 2.4; ctx.shadowColor = '#32d2ee'; ctx.shadowBlur = 9;
  for (const [from,to] of data.edges) { ctx.beginPath(); ctx.moveTo(...point(from)); ctx.lineTo(...point(to)); ctx.stroke(); }
  ctx.fillStyle = '#efffff';
  data.points.forEach((_, index) => { ctx.beginPath(); ctx.arc(...point(index), 3.4, 0, Math.PI * 2); ctx.fill(); });
}
