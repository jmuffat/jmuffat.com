"use client"
import {FormattedDate} from 'react-intl'

export const ThreadDate = ({children})=>{
    const value = new Date(children)
    return (
        <span className='inline-block w-20'>
            <FormattedDate value={value} year="numeric" month="2-digit" day="2-digit"/>
        </span>
    )
}