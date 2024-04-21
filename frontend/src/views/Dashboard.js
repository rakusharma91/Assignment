import "react-datepicker/dist/react-datepicker.css";

import React, { useState, useEffect } from "react";
import Select from 'react-select';
import DatePicker from "react-datepicker";
import ReactECharts from 'echarts-for-react';
import CountUp from 'react-countup';

import { STATUS_SUCCESS} from './../config/global_constants';
import { callBackendAPI, currencyFormat } from './../helper/service.js';

import { Card, Table, Container, Row, Col} from "react-bootstrap";
function Dashboard() {
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] 	= useState("");
	const [stateList, setStateList] = useState([]);
	const [stateId, setStateId] 	= useState("");
	const [stats, setStats] 		= useState({});
	const [customerList, setCustomerList] = useState([]);
	const [customerId, setCustomerId] 	= useState("");

	useEffect(()=>{
		callBackendAPI([{path: 'get-states'}]).then(apiRes=>{			
			if(apiRes.success && apiRes.data && apiRes.data[0].status === STATUS_SUCCESS && apiRes.data[0].result && apiRes.data[0].result.length){
				setStateId(apiRes.data[0].result[0]);
				setStateList(apiRes.data[0].result);				
				setCustomerList(apiRes.data[0].customers);				
			}
		}).catch(err => console.log(err));
	},[]);

	useEffect(()=>{
		if(stateId && stateId.value){
			callBackendAPI([{path: 'get-state-stats', state: stateId.value, startDate: startDate, endDate: endDate, customer_id: customerId && customerId.value ? customerId.value :"" }]).then(apiRes=>{			
				if(apiRes.success && apiRes.data && apiRes.data[0].status === STATUS_SUCCESS && apiRes.data[0].result){
					setStats(apiRes.data[0].result);				
				}
			}).catch(err => console.log(err));			
		}
	},[stateId, startDate, endDate, customerId]);	

	function changeDate(isFormDate, value){
		if(isFormDate){
			if(endDate && value > endDate) setEndDate(value);
			setStartDate(value);
		}else{
			if(startDate && value < startDate) setStartDate(value);
			setEndDate(value);
		}
	}// end changeDate()
	
	const handleRawChange = e => {
		e.preventDefault(); // Prevent any value from being typed into the input field
	};	  

	return (	
		<Container fluid> 		
			<Row className="mb-4">
				<Col lg="2" sm="12">
					Sales Overview
				</Col>
				<Col lg="10" sm="12">
					<Row>
						<Col lg="3" xs="12" >
							<Select
								className="basic-single"
								classNamePrefix="select"
								value={stateId}
								isSearchable={true}
								placeholder="Select State"
								isDisabled={!stateList.length ? true :false}
								isLoading={!stateList.length ? true :false}
								name="state"
								options={stateList}
								onChange={(val) =>{setStateId(val)}}
							/>
						</Col>
						<Col lg="3" xs="12" >
							<Select
								className="basic-single"
								classNamePrefix="select"
								placeholder="Select Customer"
								value={customerId}
								isSearchable={true}
								isDisabled={!customerList.length ? true :false}
								isLoading={!customerList.length ? true :false}
								name="customer"
								options={customerList}
								onChange={(val) =>{ setCustomerId(val) }}
							/>
						</Col>
						<Col lg="3" xs="12">
							<DatePicker 
								placeholderText="Start Date" 
								className="height-36" 
								maxDate={endDate} 
								selected={startDate} 
								onChange={(date) => changeDate(true,date)}
								onChangeRaw={handleRawChange} 
								peekNextMonth
								showMonthDropdown
								showYearDropdown
								dropdownMode="select"
							/>
						</Col>
						<Col lg="3" xs="12">
							<DatePicker 
								placeholderText="End Date" 
								className="height-36" 
								minDate={startDate} 
								selected={endDate} 
								onChange={(date) => changeDate(false, date)}  
								onChangeRaw={handleRawChange} 								
							/>
						</Col>
					</Row>
				</Col>
			</Row>
			<Row>
				<Col lg="3" sm="6">
					<Card className="card-stats">
						<Card.Body>
							<Row>
								<Col xs="5">
									<div className="icon-big text-center icon-warning">
										<i className="nc-icon nc-chart text-warning"></i>
									</div>
								</Col>
								<Col xs="7">
									<div className="numbers">
										<p className="card-category">Total Sales</p>
										<Card.Title as="h5">
											<CountUp end={stats.sales ? stats.sales :0} prefix="$ " />
										</Card.Title>
									</div>
								</Col>
							</Row>
						</Card.Body>						
					</Card>
				</Col>
				<Col lg="3" sm="6">
					<Card className="card-stats">
						<Card.Body>
							<Row>
								<Col xs="5">
									<div className="icon-big text-center icon-warning">
										<i className="nc-icon nc-light-3 text-success"></i>
									</div>
								</Col>
								<Col xs="7">
									<div className="numbers">
										<p className="card-category">Quantity Sold</p>
										<Card.Title as="h5">
											<CountUp end={stats.quantity ? stats.quantity :0}  />
										</Card.Title>
									</div>
								</Col>
							</Row>
						</Card.Body>						
					</Card>
				</Col>
				<Col lg="3" sm="6">
					<Card className="card-stats">
						<Card.Body>
							<Row>
								<Col xs="5">
									<div className="icon-big text-center icon-warning">
										<i className="nc-icon nc-vector text-danger"></i>
									</div>
								</Col>
								<Col xs="7">
									<div className="numbers">
										<p className="card-category">Discount</p>
										<Card.Title as="h5">
											<CountUp end={stats.discount ? stats.discount :0} prefix="$ " />
										</Card.Title>
									</div>
								</Col>
							</Row>
						</Card.Body>						
					</Card>
				</Col>
				<Col lg="3" sm="6">
					<Card className="card-stats">
						<Card.Body>
							<Row>
								<Col xs="5">
									<div className="icon-big text-center icon-warning">
										<i className="nc-icon nc-favourite-28 text-primary"></i>
									</div>
								</Col>
								<Col xs="7">
									<div className="numbers">
										<p className="card-category">Profit</p>
										<Card.Title as="h5">
											<CountUp end={stats.profit ? stats.profit :0} prefix="$ " />
										</Card.Title>
									</div>
								</Col>
							</Row>
						</Card.Body>						
					</Card>
				</Col>
			</Row>
			<Row>
				<Col md="6">
					<Card>
						<Card.Header>
							<Card.Title as="h4">Sales By City </Card.Title>
						</Card.Header> 
						<Card.Body>							
							{ stats.city &&  stats.city.length?
								<ReactECharts style={{height:"350px"}} option={{
									xAxis: {
										type: 'value',
										show: false, // Hide the x-axis
									},
									yAxis: {
										type: 'category',
										data: stats.city.map(item => item.id),
										axisLine: { show: false }, // Hide the y-axis line
										axisTick: { show: false }, // Hide the y-axis ticks
										axisLabel: { show: true, color: '#333' }, // Hide the y-axis labels
									},
									grid: {
										left: '0%', // Adjust left padding
										right: '0%', // Adjust right padding
										top: '0%', // Adjust top padding
										bottom: '0%', // Adjust bottom padding
										containLabel: true,											
									},
									series: [
										{
											type: 'bar',
											barWidth: "40%",
											barGap: '10%', // Add margin between bars
											barCategoryGap: '0%',
											data: stats.city.map(item => item.sales),
										},
									],
								}}
								/>									
							:<>
								<p className="text-center border-top pt-3"> No data available </p>
							</>}							
						</Card.Body>						
					</Card>
				</Col>
				<Col md="6">
					<Card>
						<Card.Header>
							<Card.Title as="h4">Sales By Product</Card.Title>
						</Card.Header>
						<Card.Body>
							<div className="table-full-width">
								<Table>
									{stats.productname && stats.productname.length ?
										<>
											<thead>
												<tr>
													<th>
														Product Name
													</th>
													<th >
														Sales
													</th>
												</tr>
											</thead>
											<tbody>												
												{stats.productname.map((element, index) => 
													<tr key={"product-"+index} className="tr-section">
														<td>
															<small>
																{element.id}
															</small>															
														</td>
														<td className="sales">
															<small>
																{currencyFormat(element.sales)}
															</small>															
														</td>														
													</tr>														
												)}												
											</tbody>
										</>
									:
										<tbody>
											<tr>
												<td colSpan={2}>
													<p className="text-center"> No data available </p>
												</td>														
											</tr>
										</tbody>
									}

								</Table>									
							</div>					
						</Card.Body>
					</Card>
				</Col>
			</Row>
			<Row>
				<Col md="4">
					<Card>
						<Card.Header>
							<Card.Title as="h4">Sales By Category</Card.Title>
						</Card.Header>
						<Card.Body>							
							{ stats && stats.category ?
								<ReactECharts 
									style={{ height: '400px' }}
									option={{
										tooltip: {
											trigger: 'item',
											formatter: '{c} ({d}%)',
											type: 'scroll', 
											z: 999
										},
										legend: {
											orient: 'horizontal',
											bottom: -6,
											data: stats.category.map(item => item.id ),
										},
										series: [{
											type: 'pie',
											radius: ['50%', '70%'], // Inner and outer radius
											avoidLabelOverlap: false,
											label: {
												show: false,
												position: 'center'
											},
											emphasis: {
												label: {
													show: true,
													fontSize: '20',
													fontWeight: 'bold'
												}
											},
											labelLine: {
												show: false
											},
											data: stats.category.map(item => ({ value: item.sales, name: item.id })),
										}]									
									}} 
								/>
							:<p className="text-center border-top pt-3"> No data available </p>}						
						</Card.Body>						
					</Card>
				</Col>
				<Col md="4">
					<Card className="card-tasks">
						<Card.Header>
							<Card.Title as="h4">Sales By Sub Category</Card.Title>
						</Card.Header>
						<Card.Body>							
							<div className="table-full-width">
								<Table>
									{stats.subcategory && stats.subcategory.length ?
										<>
											<thead>
												<tr>
													<th>
														Sub Category
													</th>
													<th >
														Sales
													</th>
												</tr>
											</thead>										
											<tbody>
												{stats.subcategory.map((element, index) => 
													<tr key={"subcategory-"+index} className="tr-section">
														<td>
															<small>
																{element.id}
															</small>
														</td>
														<td className="sales">
															<small>
																{currencyFormat(element.sales)}
															</small>																
														</td>														
													</tr>														
												)}												
											</tbody>
										</>
									:
										<tbody>
											<tr>
												<td >
													<p className="text-center"> No data available </p>
												</td>														
											</tr>
										</tbody>
									}
								</Table>									
							</div>							
						</Card.Body>						
					</Card>
				</Col>
				<Col md="4">
					<Card className="card-tasks">
						<Card.Header>
							<Card.Title as="h4">Sales By Segment </Card.Title>
						</Card.Header>
						<Card.Body>							
							{stats && stats.segment ?
								<ReactECharts 
									style={{ height: '400px' }}
									option={{
										tooltip: {
											trigger: 'item',
											formatter: '{c} ({d}%)',
											type: 'scroll', 
											z: 999
										},
										legend: {
											orient: 'horizontal',
											bottom: 10,
											left:20,
											right:0,
											data: stats && stats.segment ? stats.segment.map(item => item.id ) :[],
										},										
										series: [{
											type: 'pie',
											radius: ['50%', '70%'], // Inner and outer radius
											// avoidLabelOverlap: false,
											label: {
												show: false,
												position: 'center'
											},
											emphasis: {
												label: {
													show: true,
													fontSize: '20',
													fontWeight: 'bold'
												}
											},
											labelLine: {
												show: false
											},
											data: stats && stats.segment ? stats.segment.map(item => ({ value: item.sales, name: item.id })) :[],
										}]									
									}} 
								/>
							:<p className="text-center border-top pt-3"> No data available </p>}							
						</Card.Body>						
					</Card>
				</Col>
			</Row>
		</Container>		
	);
}

export default Dashboard;
