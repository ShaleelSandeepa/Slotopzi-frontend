import React, { useState, useEffect } from 'react'
import CostEstimation from '../../components/Atoms/CostEstimation'
import SelectedServiceActivitiesSVAD from '../../components/Atoms/SelectedServiceActivitiesSVAD'
import SelectedSevicesSVAD from '../../components/Atoms/SelectedSevicesSVAD'
import SectionItems from '../../components/Atoms/serviceStation/SectionItems'
import SectionSelectionTop from '../../components/Atoms/serviceStation/SectionSelectionTop'
import SelectionSectionNavbar from '../../components/Atoms/serviceStation/SelectionSectionNavbar'
import TopContainerVNo from '../../components/Atoms/technician/TopContainerVNo'
import TimeEstimationSVAD from '../../components/Atoms/TimeEstimationSVAD'
import SelectionSectionNavbarMolecular from '../../components/Moleculars/serviceAdvisor/SelectionSectionNavbarMolecular'
import SideNav from '../../components/Moleculars/serviceAdvisor/sideNav'
import axios from 'axios'
import { getCookie } from '../../jsfunctions/cookies'
import { useLocation, useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { toast } from 'react-toastify'


export default function SectionSelection() {
    const [sectionName, setsectionName] = useState();
    const [subCatDetails, setsubCatDetails] = useState([{}]);
    const [repairList, setrepairList] = useState([]);
    const [totalTime, settotalTime] = useState(0);
    const [estimatedPrice, setestimatedPrice] = useState(0);
    const [estimatedTime, setestimatedTime] = useState(0);
    
    // const repairId=0;
    const history = useHistory();

    const location = useLocation();
    console.log(location.state);

    var config = {
        headers: {
            'Authorization': 'Bearer ' + getCookie('token'),
        }
    }
    function proceedRepair() {
        //Add Repair
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/advisor/addRepair`, {
            "paymentType": "ONLINE",
            "userId": location.state.userId,
            "vin": location.state.vin
        }, config)
            .then(function (response) {
                console.log(response.data);
                toast.success('✔ Repair Added Successfully');
                // Then add service entries
                axios.post(`${process.env.REACT_APP_API_BASE_URL}/advisor/add service entries`, {
                    "userId": location.state.userId,
                    "repairId": response.data,
                    "serviceEntryInstances": repairList
                }, config)
                    .then(function (res) {
                        toast.success('✔ Entries Added Successfully');
                        console.log(res.data);
                        axios.get(`${process.env.REACT_APP_API_BASE_URL}/advisor/nextslot/${response.data}`, config)
                            .then(function (nextSlotResponse) {
                                console.log(nextSlotResponse.data);
                                toast.success('✔ Next Slot is ' + nextSlotResponse.data.slotName,{ onClose: () => history.push('/serviceadvisor') });
                            })
                            .catch(function (error) {
                                // console.log(error.nextSlotResponse.data);
                                toast.error('❌' + error.nextSlotResponse.data);
                            })

                    })
                    .catch(function (error) {
                        // console.log(error.nextSlotResponse.data);
                        toast.error('❌' + error.res.data);
                    })
                    // history.push({
                    //     pathname: '/serviceadvisor',
                    //     state: response.data
                    // });               

            })
            .catch(function (error) {
                // console.log(error.nextSlotResponse.data);
                toast.error('❌' + "Failed to Get Next Slot");
            })

    }
    
    // function checkTime() {
    //     console.log(repairList);
    //     axios.post(`http://127.0.0.1:5000/app/`, {
    //         "order": 20,
    //         "serviceEntries": repairList.map(repair => repair.itemName)
    //     }, config)
    //     .then(function (res) {
    //         toast.success('✔ Time Estimation Set');
    //         console.log(res.data);
            
    //         setestimatedTime(res.data);
    //     })
    //     // alert(JSON.stringify(repairList.map(repair => repair.itemName)));

    // }

    // function checkTime() {
    //     console.log('Repair List:', repairList);
    
    //     const requestBody = {
    //         order: 20, // Adjust order value dynamically if needed
    //         serviceEntries: repairList.map(repair => repair.itemName)
    //     };
    
    //     axios.post(`http://127.0.0.1:5000/app/`, requestBody, {
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //     })
    //     .then(response => {
    //         console.log('Response Data:', response.data);
    
    //         if (response.data.time_estimated) {
    //             setestimatedTime(response.data); // Directly update with the estimated time
    //             toast.success('✔ Time Estimation Set');
    //         } else {
    //             throw new Error('Invalid response structure');
    //         }
    //     })
    //     .catch(error => {
    //         console.error('Error occurred:', error.response ? error.response.data : error.message, error);
    //         toast.error('✘ Failed to fetch estimation');
    //     });
    // }

    function checkTime() {
        console.log('Repair List:', repairList);
    
        const requestBody = {
            order: 20, // Adjust order value dynamically if needed
            serviceEntries: repairList.map(repair => repair.itemName)
        };
    
        axios.post(`http://127.0.0.1:5000/app/`, requestBody, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            console.log('Response Data:', response.data);
    
            // Check if the response has the expected structure
            if (response.data) {
                setestimatedTime(response.data); // Directly update with the estimated time
                if(response.data.time_estimated != 0) {
                    toast.success('✔ Time Estimation Set');
                }
            } else if (Array.isArray(response.data)) {
                // Handle cases where the response is an array for single service entries
                if (response.data[0] && response.data[0].time_estimated) {
                    setestimatedTime(response.data[0]);
                    toast.success('✔ Time Estimation Set');
                } else {
                    throw new Error('Invalid response structure');
                }
            } else {
                throw new Error('Invalid response structure');
            }
        })
        .catch(error => {
            console.error('Error occurred:', error.response ? error.response.data : error.message, error);
            toast.error('✘ Failed to fetch estimation');
        });
    }
    
    
    

    function inspectionOnly() {
        // alert("Redirect");
        if (window.confirm("Are you sure you want to redirect to Dashboard?")) {
            history.push('/serviceadvisor');
        }
        
    }
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/advisor/getSubCategories/${sectionName}`, config)
            .then(function (response) {
                console.log(response.data);
                setsubCatDetails(response.data);
            })
    }, [sectionName])

    function loadNewValues() {
        // checkTime();
    }

    useEffect(() => {
        checkTime(); // Automatically called whenever `repairList` changes
    }, [repairList]);
    


    return (
        <div className=" bg-Background-0 h-full pb-12 xl:h-full">
            <div className="flex flex-row">
                <div className="">
                    <SideNav />
                </div>
                <div className="w-full flex flex-col xl:ml-40 overflow-hidden">
                    <SectionSelectionTop heading1={location.state.vehicleNo} />
                    <div className="grid grid-cols-1 xl:grid-cols-4 xl:ml-8  w-11/12 xl:w-10/12 ">
                        <div className="w-full bg-white shadow-xl rounded-lg mt-12  px-8 py-16 xl:col-span-3">
                            <div className="font-primary text-xl">Select Section</div>
                            <div className="  p-1 rounded-lg mt-4 w-full">
                                <SelectionSectionNavbarMolecular sectionName={sectionName} setsectionName={setsectionName} />
                            </div>
                            <div>
                                {subCatDetails.map(subCat => <SectionItems estimatedPrice={estimatedPrice} setestimatedPrice={setestimatedPrice}
                                    totalTime={totalTime} settotalTime={settotalTime} setrepairList={setrepairList} repairList={repairList}
                                    subCat={subCat} reload={loadNewValues}/>)}
                            </div>
                        </div>
                        <div className=" w-full xl:w-80 2xl:w-96 mb-12 bg-white shadow-xl rounded-lg mt-12 p-8 xl:ml-12 xl:mb-0">
                            <SelectedSevicesSVAD heading1="Selected Service" description="Time and Cost can be differ with the change of requirements " />
                            <div className="mt-6 mb-4">

                                {repairList.map(addedRepair => <SelectedServiceActivitiesSVAD addedRepair={addedRepair}
                                    repairList={repairList} setrepairList={setrepairList} totalTime={[totalTime, settotalTime]}
                                    estimatedPrice={[estimatedPrice, setestimatedPrice]} />)}

                                <div className="border-b-2 mt-4"></div>
                            </div>
                            <div className="mt-6 ml-12 mr-12 xl:ml-1 xl:mr-1">
                                <TimeEstimationSVAD time={(parseFloat(estimatedTime.time_estimated)).toFixed(2)} />
                            </div>
                            <div className="mt-6 ml-12 mr-12 xl:ml-1 xl:mr-1">
                                {/* current cost rate - per min = 5500/60 */}
                                {/* current cost rate - per hour = 3500*/}
                                <CostEstimation cost={((parseFloat(estimatedTime.time_estimated))/60*3500).toFixed(2)} />
                                {/* Need to add styles */}
                                <div className="flex flex-col justify-center items-center">
                                    <button onClick={checkTime} className=" w-64 xl:w-56 bg-green-800 text-white rounded-lg p-4 mt-4 mb-6">Check Time/Cost</button>
                                    <button onClick={inspectionOnly} className="  w-64 xl:w-56 bg-red-800 text-white rounded-lg p-4  mt-8">Inspection Only</button>
                                    <button onClick={proceedRepair} className="  w-64 xl:w-56 bg-blue-800 text-white rounded-lg p-4  mt-8">Proceed to repair</button>
                                </div>
                            </div>
                            <div className="border-b-2 mt-4"></div>
                            <div className="border-b-2 mt-6"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

