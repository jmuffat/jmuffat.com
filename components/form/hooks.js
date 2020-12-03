import React from 'react';

const changeData = e=>( {[e.currentTarget.field]:e.currentTarget.value} )

export function useForm(defaultValues){
  const [data, setData] = React.useState(defaultValues);
  const updateData = update=>setData({...data,...update})

  return {
    parent:null,
    data,
    setData,
    onChange: e=>updateData(changeData(e)),
    updateData
  };
}

export function useSubForm(parent,field){
  const setData = data=>{
    parent.updateData({
      [field]: data
    })
  }

  const updateData = update=>{
    parent.updateData({
      [field]: {...parent.data[field],...update}
    })
  }

  return {
    parent,
    data: parent.data[field],
    setData,
    onChange: e=>updateData(changeData(e)),
    updateData
  };
}
