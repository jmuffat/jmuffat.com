export class xform {
  constructor(u=0){
    this.setRotZ(u);
  }

  transform(A){
    return {
      x: A.x*this._11 + A.y*this._12 + A.z*this._13,
      y: A.x*this._21 + A.y*this._22 + A.z*this._23,
      z: A.x*this._31 + A.y*this._32 + A.z*this._33
    }
  }

  setRotZ(u){
    const c=Math.cos(u);
    const s=Math.sin(u);

    this._11=c;  this._12=s; this._13=0;
    this._21=-s; this._22=c; this._23=0;
    this._31=0;  this._32=0; this._33=1;
  }
}
