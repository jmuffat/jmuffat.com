"use client"
import React from 'react'

function NativeShare(props) {

  const onPress = ()=>{
    navigator.share({
      title: props.title || 'jmuffat.com',
      text: props.text,
      url: props.url,
    })
  }

  return (
    <button onClick={onPress}><i className="fas fa-share-alt"></i> share</button>
  );
}


function ButtonBar(props) {
  const onPress = ()=>{
    window.location.href = `https://www.facebook.com/sharer/sharer.php?u=${props.url}`;
  }

  return (
    <button onClick={onPress}>
      <i className="fab fa-facebook" style={{color:"#1877f2"}}></i> share
    </button>);
}

export default function ShareButton(props) {
  var [shareMethod,setShareMethod] = React.useState(0)

  React.useEffect(()=>{
    setShareMethod(navigator.share? 1 : 2)
  },[])

  switch (shareMethod) {
      case 0: return null;
      case 1: return <NativeShare {...props}/>;
      case 2: return <ButtonBar {...props}/>;
  }
}
