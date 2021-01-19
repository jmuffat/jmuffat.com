const D2R=Math.PI/180;
const R2D=180/Math.PI;

export function mercator(A){
  const lon=A.x;
  const lat=Math.max(-85,Math.min(85,A.y));
  return {
    x: lon,
    y: Math.log(Math.tan( (45+lat/2)*D2R) ) *R2D
  }
}
