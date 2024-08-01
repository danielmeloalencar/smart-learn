import { useEffect, useRef, useState } from "react"
import { PanelProps, usePanel, usePanelActions } from "../components/panels"
import { useNotes } from "../hooks/note"

import Graph from 'react-vis-network-graph'
import { Panel } from "../components/panel";
import Diversity2Icon from '@mui/icons-material/Diversity2';

export function GraphPanel({ id, params = {}, onClose }: PanelProps){
 const { layout = "centered" } = params
 const notes = useNotes()
 const { updatePanel,openPanel } = usePanelActions()
 const panel = usePanel()
 

const refContainer = useRef<HTMLDivElement>(null);
 const [dimensions, setDimensions] = useState({
     width: 0,
     height: 0,
 });

useEffect(() => {
    if (refContainer.current) {
        const { offsetWidth, offsetHeight } = refContainer.current;
        setDimensions({
            width: offsetWidth,
            height: offsetHeight,
        });
    }
}, [layout]);

 // get notes and add in array from type useNotes(): Map<string, Note>
  const notesArray = Array.from(notes.values())
  //filtra notas removendo as que possuem template note?.frontmatter?.template)
  const filteredNotes =   notesArray.filter((note)=> note?.frontmatter?.template === undefined || note?.frontmatter?.template === null)
  const nodes = filteredNotes.map((note)=>{
    return {id:parseInt(note.id),label:note.title,color: '#4ccce6', title:note.title }
  })

  
// cria uma função que percorre cada item do array, pega titulo da nota e seus backlinks , 
// onde cada nó é uma nota e cada aresta é uma ligação entre as notas, usando typscript
  const edges = notesArray.map((note) => {
    return note.backlinks.map((backlink) => {
      return { from: parseInt(backlink), to: parseInt(note.id) ,arrows: {from: {enabled: false, type: "bar"}, to: {enabled: false, type: 'bar'}}}
    })
  }).flat()




const [state] = useState({

  graph: {
    nodes: nodes,
    edges: edges
  },
  events: {
   /* select: ({ nodes, edges }) => {
      console.log("Selected nodes:");
      console.log(nodes);
      console.log("Selected edges:");
      console.log(edges);
    //  alert("Selected node: " + nodes);
    
    },*/
    doubleClick: ({nodes }: { nodes: number[] }) => {
      console.log({nodes})
     // alert(nodes)
       //navigate to page with id parameter with react router
       if(!nodes[0]) return
       const newName = String(nodes[0])
       
       
        if (panel) {
          //Se esta tela estiver carregada num painel, atualize o painel
         updatePanel?.(panel.index, { pathname: `/graph/${newName}` })
       } else {
        // senão, abra um novo painel com a nota
        openPanel?.( { pathname: `/${newName}` })
       }
      
    }
  }
})
const { graph, events } = state;
  
  return (
    <Panel id={id} title="Rede de Conhecimento" icon={<Diversity2Icon />} onClose={onClose}>
      <div className="flex flex-col gap-2 p-4 h-full min-h-full">
        <div className="flex w-full flex-col gap-4 overflow-y-hidden overflow-x-hidden p-2 h-full min-h-full " ref={refContainer}>
        <Graph 
      id="dasd"
            graph={graph}
            key={ dimensions.height}
            options= {{physics: {
              enabled: true
          },
          interaction: {
              navigationButtons: false
          },
          nodes: {
            shape: "dot",
              borderWidth: 1,
              size: 10,
              color: {
   
              },
              font: {color: "#666666"}
          },
          edges:{
            arrows: {to: {enabled: true, scaleFactor:1, type:'arrow'}},
            
            color: "#666666",
            smooth: {
              type: "dynamic" //'dynamic', 'continuous', 'discrete', 'diagonalCross', 'straightCross', 'horizontal', 'vertical', 'curvedCW', 'curvedCCW', 'cubicBezier'
          }
        
        },

          shadow: true,
          smooth: true,
          height: dimensions.height+'px',
          width:dimensions.width +'px',
        }}
           events={events}
 
        />
        </div>
      </div>
    </Panel>
  )
}
