import { cn } from "@/lib/utils";
import styles from './sksc.module.css'
import {knownMask,candidateMask} from './state'

const VisibilityHoriz = ({line,val}) =>(
    val.map((a,i)=>(
        <div 
            key={i} 
            className={cn(
                styles.visib,
                `row-${line+1}`,
                `col-${i+2}`
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
                `row-${i+2}`,
                `col-${col+1}`
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
            `row-${row}`,
            `col-${col}`
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
                `row-${row}`,
                `col-${col}`
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
        <div className="p-4 border size-fit mx-auto">
            <div 
                className={cn(
                    'grid gap-1',
                    `grid-cols-${data.sz+2}`,
                    `grid-rows-${data.sz+2}`
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


// ----------
const dummyUseOfTailwindSymbolsWeMayGenerate = ()=>(
    <div>
        <div className="row-1 row-2 row-3 row-4 row-5 row-6 row-7 row-8 row-9"/>
        <div className="col-1 col-2 col-3 col-4 col-5 col-6 col-7 col-8 col-9"/>
        <div className="grid-cols-1 grid-cols-2 grid-cols-3 grid-cols-4 grid-cols-5 grid-cols-6 grid-cols-7 grid-cols-8 grid-cols-9 grid-cols-10 grid-cols-11 grid-cols-12"/>
        <div className="grid-rows-1 grid-rows-2 grid-rows-3 grid-rows-4 grid-rows-5 grid-rows-6 grid-rows-7 grid-rows-8 grid-rows-9 grid-rows-10 grid-rows-11 grid-rows-12"/>
    </div>
)