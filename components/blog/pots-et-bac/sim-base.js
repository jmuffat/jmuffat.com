const switchAxis = fitting=>fitting.map(a=>({cx:a.cy,cy:a.cx}))

function selectBest(methods, fit) {
  return methods
    .map(m=>fit(m))
    .reduce(
      (cur,a)=> cur.length>=a.length? cur : a,
      []
    );
}

function fitCircles_square(width,height) {
  var circles = []

  for(var cy=0.5; cy<=height-0.499; cy++) {
    for(var cx=0.5; cx<=width-0.499; cx++) {
      circles.push({cx,cy})
    }
  }

  return circles
}

function fitCircles_hex(width,height) {
  if (width<=2) return fitCircles_square(width,height)

  var circles = []
  var dy = Math.sqrt(3)/2

  var offset = 0
  for(var cy=0.5; cy<=height-0.499; cy+=dy) {
    for(var cx=0.5+offset; cx<=width-0.499; cx++) {
      circles.push({cx,cy})
    }
    offset = 0.5-offset
  }

  return circles
}

function fitCircles_hex2(width,height) {
  return switchAxis( fitCircles_hex(height,width) )
}

function fitCircles_spread(width,height){
  if (width<=2) return fitCircles_square(width,height)

  var circles = []

  const n = Math.floor(width)
  const dx = (width-1)/(n-1)
  const h = Math.max(0.5,Math.sqrt(4-dx*dx)/2)

  var offset = 0
  for(var y=0.5; y<=height-0.499; y+=h){
    for(var x=0.5+offset; x<=width-0.499; x+=dx) {
      circles.push({cx:x,cy:y})
    }

    offset = dx/2 - offset
  }

  return circles
}

function fitCircles_spread2(width,height) {
  return switchAxis( fitCircles_spread(height,width) )
}

function fitCircles_spread3(width,height){
  if (width<=1.5) return fitCircles_square(width,height)
  var circles = []

  const n  = Math.floor(width)
  const dx = Math.max(1, (2*width-2)/(2*n-1) )
  const h  = Math.max(0.5,Math.sqrt(4-dx*dx)/2 )

  var offset = 0
  for(var y=0.5; y<=height-0.499; y+=h){
    for(var x=0.5+offset; x<=width-0.499; x+=dx) {
      circles.push({cx:x,cy:y})
    }

    offset = dx/2 - offset
  }

  return circles
}

function fitCircles_spread4(width,height) {
  return switchAxis( fitCircles_spread3(height,width) )
}

function tag(method,circles){
  circles[0].method = method
  return circles
}

export function fitCircles(width,height, method) {
  if (!width || !height) return []

  switch (method) {
    case '1': return tag(method,fitCircles_square(width,height))
    case '2': return tag(method,fitCircles_hex(width,height))
    case '3': return tag(method,fitCircles_hex2(width,height))

    default: return selectBest(
        ['1','2','3'],
        m=>fitCircles(width,height,m)
      )
  }
}

export function fitCircles2(width,height, method) {
  if (!width || !height) return []

  switch (method) {
    case '1': return tag(method,fitCircles_square(width,height))
    case '2': return tag(method,fitCircles_hex(width,height))
    case '3': return tag(method,fitCircles_hex2(width,height))
    case '4': return tag(method,fitCircles_spread(width,height))
    case '5': return tag(method,fitCircles_spread2(width,height))
    case '6': return tag(method,fitCircles_spread3(width,height))
    case '7': return tag(method,fitCircles_spread4(width,height))

    default: return selectBest(
        ['1','2','3','4','5','6','7'],
        m=>fitCircles2(width,height,m)
      )
  }
}
