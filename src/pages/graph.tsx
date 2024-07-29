import { useState } from "react"
import { Panels } from "../components/panels"
import { useNotes } from "../hooks/note"

import Graph from 'react-vis-network-graph'
import { useNavigate } from "react-router-dom";
import { Panel } from "../components/panel";
import Diversity2Icon from '@mui/icons-material/Diversity2';
export function GraphPage() {

  const notes = useNotes()

 const navigate = useNavigate()

 // get notes and add in array from type useNotes(): Map<string, Note>
  const notesArray = Array.from(notes.values())
  const nodes = notesArray.map((note)=>{
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
      navigate("/"+nodes[0]);
      
    }
  }
})
const { graph, events } = state;
  return (
    <Panels.Container>
          <Panel   title="Rede de Conhecimento" icon={<Diversity2Icon/>}  layout="fullwidth">
      <Graph 
      id="dasd"
            graph={graph}
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
              type: "cubicBezier" //'dynamic', 'continuous', 'discrete', 'diagonalCross', 'straightCross', 'horizontal', 'vertical', 'curvedCW', 'curvedCCW', 'cubicBezier'
          }
        
        },

          shadow: true,
          smooth: true,
          height: "100%",
          width:'100%'
        }}
           events={events}
 
        />
      
      <Panels.Outlet />
</Panel>
    </Panels.Container>
  )
}
