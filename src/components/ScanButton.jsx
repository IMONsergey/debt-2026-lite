import {useRef} from 'react';
export function ScanButton({children,onClick,href,variant='primary',className=''}){
 const ref=useRef(null); const move=e=>{const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--bx',`${e.clientX-r.left}px`);e.currentTarget.style.setProperty('--by',`${e.clientY-r.top}px`)};
 const C=href?'a':'button'; const props=href?{href,target:href.startsWith('http')?'_blank':undefined,rel:'noreferrer'}:{type:'button',onClick};
 return <C ref={ref} className={`v5-scan-btn is-${variant} ${className}`} onPointerMove={move} {...props}><span className="v5-scan-btn__grid"/><span className="v5-scan-btn__sweep"/><span className="v5-scan-btn__label">{children}</span><span className="v5-scan-btn__arrow">↗</span></C>
}
