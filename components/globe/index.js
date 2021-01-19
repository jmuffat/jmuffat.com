import React from 'react';
import {useGeoshape3D} from './data';
import {xform} from './xform';

function TransformPolyline(props){
  const points=props.points;
  const X=props.xform;

  const view=(
    points
    .map(A=>X.transform(A))
    .reduce(
      (res,A)=>{
        if (A.y>=0){
          res.cur.push(A);
        }
        else {
          if (res.cur.length>1) res.polylines.push(res.cur);
          res.cur=[];
        }
        return res;
      },
      {cur:[],polylines:[]}
    )
  );

  if (view.cur.length>1) view.polylines.push(view.cur);

  if (!view.polylines.length) return null;

  return (
    <g>{
      view.polylines
      .map((pts,i)=>{
        const s=pts
          .map((A,i)=>`${i?'L':'M'}${A.x.toFixed(6)},${A.z.toFixed(6)}`)
          .join('');
        return <path key={i} d={s}/>;
      })
    }</g>
  );
}

function Globe(props){
  const [data ] = useGeoshape3D('/data/ne_110m_coastline.shp');
  const [dataR] = useGeoshape3D('/data/ne_110m_admin_0_boundary_lines_land.shp');
  const [t,setT]=React.useState(0);
  const t0=new Date();

  React.useEffect(() => {
    const id = setInterval(() => {
      setT(t=>(new Date()-t0)/1000);
    }, 33);
    return ()=>clearInterval(id);
  }, []);

  const width = 512;
  const height= 512;
  const r=Math.min(width,height)*.9/2;

  const X=new xform(t*Math.PI/5);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg">
      <rect fill="#f8f8f8" id="background" width={width+2} height={height+2} y="-1" x="-1"/>
      <circle cx={width/2} cy={height/2} r={r} fill="#fff"/>
      <g transform={` translate(${width/2} ${height/2}) scale(${r})`} strokeWidth={0.5/r} stroke="#000" fill="none">
        {data && <g stroke="#000" fill="none">
          {data.map((polyline,key)=><TransformPolyline key={key} points={polyline.points} xform={X}/>)}
        </g>}
        {dataR && <g stroke="#aaa"  fill="none">
          {dataR.map((polyline,key)=><TransformPolyline key={key} points={polyline.points}xform={X}/>)}
        </g>}
      </g>
    </svg>
  );
}

export default {Globe}
