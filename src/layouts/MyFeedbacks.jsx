import {useState, useEffect} from 'react'

import {useAuthContext} from '../hooks/useAuthContext'
import "./styles/myFeedbacks.css"
import ShowChart from './ShowChart'


const MyFeedbacks=()=>{
    const [feedbacks,setFeedbacks]=useState([]);
    const [toggleView,setToggleView]=useState(false);
    const [viewChart,setViewChart]=useState(false);
    const [val,setVal]=useState(-1)

   

     const {user,dispatchs}=useAuthContext();

     useEffect(()=>{
        const fet=`http://localhost:3005/feedback//myFeedbacks/${user.teacher._id}`
       // console.log(fet)
        
        const getFeedbacks=async()=>{
            const res=await fetch(fet)
            const data=await res.json()
          
            setFeedbacks(data.allFeedbacks);
          
          // console.log(data.allFeedbacks)
        }
        getFeedbacks();
       // console.log(feedbacks)
      

     },[]) 


     
     const handleView=(e)=>{
        //logic to view individual feedback
      
      // console.log(e.target.value)
        setVal(e.target.value);
        setToggleView(true)
       
        
     }

     const handleShowChart=()=>{
   
          //  console.log(!viewChart)
        setViewChart(!viewChart);

     }

     const handleGOBack=()=>{
        
        setToggleView(false)
        setVal(-1);
     }

     

     // setting margine for view feedback
     var mar=400;
     if(toggleView)
     {
        mar=100
     }
     
     let canSubmit=false;

    
   

    const dataForChart=[];

     const calculateDataForChart=()=>{


        for(let feedback of feedbacks)
        {
            //console.log(feedback.submission)
            var agree=0;
            var disagree=0;
            var stronglyAgree=0;
            var stronglyDisagree=0;

            for(let sub of feedback.submission)
            {
               for(let ans of sub.answers)
               {
                if(ans.selectedOption=='Disagree')
                {
                    disagree++;
                }
                else if(ans.selectedOption=='Agree')
                {
                    agree++;
                }
                else if(ans.selectedOption=='Strongly Disagree')
                {
                    stronglyDisagree++;
                }
                else if(ans.selectedOption=='Strongly Agree')
                {
                    stronglyAgree++
                }
               }
            }

            const data={
                agree,
                disagree,
                stronglyAgree,
                stronglyDisagree
            }

            dataForChart.push(data)
           
        }
       
     }

     calculateDataForChart();
    

    // console.log(dataForChart)
   
    
    
    

    return (
        
      <div>
        {!viewChart&&<div className='myFeedbacks' style={{marginLeft:mar}}>
            {!toggleView&&<h1>My Feedback Forms</h1>} 
             <div className='feeds'>
             
              {!toggleView&&feedbacks.length>0&&feedbacks.map((feedback,i)=>{
                return(
                   
                    <div key={i} className="feedback">
                        <li className='SRNO'>{i+1}</li>
                        <li className='subject'>
                        {feedback.subject}
                        </li>
                        <li className='teacher'>
                            {feedback.teacher.name}
                        </li>
                        {user&&<button value={i+1} onClick={handleView}>view</button>}
                        
                    </div>
                     
                )
               })}
               {toggleView&&<div className='fedd'> <div className="feedback" style={{width:"600px",height:"600px",marginLeft:"420px"}}>
              
                <h2>Subject Name: {feedbacks[val-1].subject}</h2>   
                <h2>Teacher Name:{feedbacks[val-1].teacher.name}</h2>   
                <div><ul>
                    {feedbacks[val-1].question.map((ele,ind)=>{
                        return <div className="quesInp" key={ind}>
                            <input type="text" value={ele.question}></input>
                           
                        </div>
                    })}
                    </ul>
                </div>
                <button  onClick={handleGOBack}>go back</button>
                 <button  onClick={handleShowChart}>show chart</button>
                </div>
                
                </div>}  
             </div>
       
        </div> }
        {viewChart&&<ShowChart handleShowChart={handleShowChart} ind={val-1} feedbacks={feedbacks} dataForChart={dataForChart[val-1]}></ShowChart>}
        
      

      </div>
      

        
       
    );
     
}

export default MyFeedbacks  