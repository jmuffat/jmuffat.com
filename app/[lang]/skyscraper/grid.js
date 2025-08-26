import { cn } from "@/lib/utils";
import styles from './sksc.module.css'
import {knownMask} from './state'
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

const KnownCell = ({row,col,value})=>(
    <div 
        className={cn(
            styles.cell,
            styles.known,
            cn_row(row),
            cn_col(col)
        )}
    >
        {value}
    </div>
)

function Cell({row,col,data}) {
    if (data&knownMask) {
        let mask = data&0x0ff
        let value
        for(value=1; value<10; value++) {
            if (mask==1) break
            mask >>= 1
        }
        return <KnownCell row={row} col={col} value={value}/>
    }
    
    function Pencil({mask, className, children}) {
        if (!(data&mask)) return null
        return <div className={className}>{children}</div>
    }

    return (
        <div 
            className={cn(
                styles.cell,
                cn_row(row),
                cn_col(col)
            )}
        >
            <Pencil mask={0x0001} className={styles.pen1}>1</Pencil>
            <Pencil mask={0x0002} className={styles.pen2}>2</Pencil>
            <Pencil mask={0x0004} className={styles.pen3}>3</Pencil>
            <Pencil mask={0x0008} className={styles.pen4}>4</Pencil>
            <Pencil mask={0x0010} className={styles.pen5}>5</Pencil>
            <Pencil mask={0x0020} className={styles.pen6}>6</Pencil>
            <Pencil mask={0x0040} className={styles.pen7}>7</Pencil>
            <Pencil mask={0x0080} className={styles.pen8}>8</Pencil>
            <Pencil mask={0x0100} className={styles.pen9}>9</Pencil>
        </div>
    )    
}

function Cells({data}) {
    const {c,sz} = data
    const res = []

    for(let i=0; i<sz; i++) {
        for(let j=0; j<sz; j++) {
            const offset = i+j*sz
            const a = c[offset]
            res.push( <Cell key={offset} row={j+2} col={i+2} data={a}/> )
        }
    }

    return res
}

export function SkyscraperGrid({data}) {
    if (data.error) {
        return <p>Error: {data.error}</p>
    }
    
    const {sz} = data;
    return (
        <div className="p-4 border bg-neutral-100 dark:bg-neutral-800 size-fit mx-auto">
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
                <Cells data={data}/>
            </div>
        </div>
    )
}
