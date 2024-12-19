"use client"
import {FormattedDate} from 'react-intl'

export const ThreadDate = ({children})=>{
    const value = new Date(children)
    return (
        <span className='inline-block text-xs font-thin w-20'>
            <FormattedDate value={value} year="numeric" month="short" day="2-digit"/>
        </span>
    )
}