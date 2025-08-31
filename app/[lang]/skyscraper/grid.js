import { cn } from "@/lib/utils";
import styles from './sksc.module.css'
import {knownMask,getKnownCell, gridCoords} from './state'
import {
    cn_row,cn_col,
    cn_gridCols,cn_gridRows
} from './util'

const VisibilityHoriz = ({line,val}) =>(
    val.map((a,i)=>(
        <div 
            key={i} 
            className={cn(
                styles.visib,
                cn_row(line+1),
                cn_col(i+2)
            )}
        >
            {val[i] || null}
        </div>
    ))
)

const VisibilityVert = ({col,val}) =>(
    val.map((a,i)=>(
        <div 
            key={i} 
            className={cn(
                styles.visib,
                cn_row(i+2),
                cn_col(col+1)
            )}
        >
            {val[i] || null}
        </div>
    ))
)

function Cell({row,col,data,prev,label,highlights}) {
    
    if (data&knownMask) {
        // Known cell
        const val      = getKnownCell(data)
        const prevVal  = getKnownCell(prev)
        return (
            <div 
                className={cn(
                    styles.cell,
                    styles.known,
                    cn_row(row),
                    cn_col(col),
                    highlights.has(label)? "bg-amber-200 text-black" : "bg-neutral-400",
                    val!=prevVal && "text-blue-700 dark:text-blue-800"
                )}
            >
                {val}
            </div>
        )
    }
    
    function Pencil({mask, className, label, children}) {
        if (!(prev&mask)) return null // was already discarded

        let extra = ""
        if (!(data&mask))               extra = "text-red-700 font-bold"
        else if (highlights.has(label)) extra = "text-green-700 font-bold"

        return <div className={cn(className,extra)}>{children}</div>
    }

    return (
        <div 
            className={cn(
                cn_row(row),
                cn_col(col),
                styles.cell,
                highlights.has(label)? "bg-amber-200 text-black" : "bg-neutral-400"
            )}
        >
            <Pencil mask={0x0001} className={styles.pen1} label={`${label}.1`}>1</Pencil>
            <Pencil mask={0x0002} className={styles.pen2} label={`${label}.2`}>2</Pencil>
            <Pencil mask={0x0004} className={styles.pen3} label={`${label}.3`}>3</Pencil>
            <Pencil mask={0x0008} className={styles.pen4} label={`${label}.4`}>4</Pencil>
            <Pencil mask={0x0010} className={styles.pen5} label={`${label}.5`}>5</Pencil>
            <Pencil mask={0x0020} className={styles.pen6} label={`${label}.6`}>6</Pencil>
            <Pencil mask={0x0040} className={styles.pen7} label={`${label}.7`}>7</Pencil>
            <Pencil mask={0x0080} className={styles.pen8} label={`${label}.8`}>8</Pencil>
            <Pencil mask={0x0100} className={styles.pen9} label={`${label}.9`}>9</Pencil>
        </div>
    )    
}

function Cells({data,prev,highlights}) {
    const {sz} = data
    const res = []

    for(let i=0; i<sz; i++) {
        for(let j=0; j<sz; j++) {
            const label = gridCoords(j,i)
            const offset = i+j*sz
            
            res.push( 
                <Cell key={label} 
                    label={label}
                    row={j+2} col={i+2} 
                    data={data.c[offset]} 
                    prev={prev.c[offset]}
                    highlights={highlights}
                /> 
            )
        }
    }

    return res
}

export function SkyscraperGrid({data,prev,highlights}) {    
    const {sz} = data;
    return (
        <div className="p-4 m-4 border bg-neutral-100 dark:bg-neutral-800 size-fit mx-auto">
            <div 
                className={cn(
                    'grid gap-1',
                    cn_gridCols(data.sz+2),
                    cn_gridRows(data.sz+2)
                )}
            >
                <VisibilityHoriz line={0}    val={data.N}/>
                <VisibilityVert  col={sz+1}  val={data.E}/>
                <VisibilityHoriz line={sz+1} val={data.S}/>
                <VisibilityVert  col={0}     val={data.W}/>
                <Cells data={data} prev={prev} highlights={highlights}/>
            </div>
        </div>
    )
}
