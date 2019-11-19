import React, { Component } from 'react';
// import Highlighter from "react-highlight-words";
import { CSVLink, CSVDownload } from "react-csv";
import Popup from "reactjs-popup";
import _ from "lodash";
import CSVReader from 'react-csv-reader'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class homeComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            textField: "",
            selectWord: "",
            entityArray: [],
            csvData: [],
            showCard: false,
            jsonToCSV: []
        }
        this.fileInput = null
    }
    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }
    selectedText(e) {
        let textComponent = e.currentTarget;
        let selectedText, startPos, endPos;
        if (textComponent.selectionStart !== undefined) {// Standards Compliant Version
            startPos = textComponent.selectionStart;
            endPos = textComponent.selectionEnd;
            selectedText = textComponent.value.substring(startPos, endPos);
        }
        if (startPos !== endPos) {
            let entityArray = [...this.state.entityArray]

            entityArray.push({ value: selectedText, entity: "", start: startPos, end: endPos })
            this.setState({ entityArray })
        }


    }
    changeEntityValue = (e, index) => {
        let { entityArray } = { ...this.state }
        entityArray[index].entity = e.target.innerText
        this.setState(entityArray)
    }

    sumitValues = () => {
        let { entityArray, textField, jsonToCSV } = { ...this.state }
        if (entityArray.length > 0) {


            let index = _.findIndex(jsonToCSV, function (o) { return o.train == textField; });
            let json = {
                train: textField,
                entity: { entities: [] }
            }

            entityArray.forEach(element => {
                json.entity.entities.push([element.start, element.end, element.entity])
            })
            json.entity = JSON.stringify(json.entity)
            if (index >= 0) {
                jsonToCSV[index] = json
                this.setState({
                    showCard: false,
                    textField: '', entityArray: [],
                    jsonToCSV
                })
            } else {
                this.setState({
                    showCard: false,
                    textField: '', entityArray: [],
                    jsonToCSV: [...jsonToCSV, json]
                })
            }

        } else {
            alert("Please add at-least one entity to submit")

        }

    }
    removeRow = (tableArray, index) => {
        let { entityArray, jsonToCSV } = { ...this.state }
        if (tableArray === "entityArray") {
            entityArray.splice(index, 1)
        } else if (tableArray === "jsonToCSV") {
            jsonToCSV.splice(index, 1)
        }
        this.setState({ entityArray, jsonToCSV })
    }
    editTable = (data) => {
        let entityArray = []
        console.log(data.entity)
        let entity = data.entity
        try {
            entity = JSON.parse(data.entity)
        } catch (e) {
            toast.warning("Can't able to convert this data", {
                position: toast.POSITION.TOP_RIGHT
            });
            console.log(e)
        }

        entity.entities && entity.entities.forEach(element => {
            let startPos = element[0]
            let endPos = element[1]
            let selectedText = element[2]
            entityArray.push({ id: data.id, value: data.train.substring(startPos, endPos), tempEntity: selectedText, entity: selectedText, start: startPos, end: endPos })
        });
        this.setState({ showCard: true, textField: data.train, entityArray })
    }

    getHighlightedWord = (data) => {
        let entity = data.entity
        try {
            entity = JSON.parse(data.entity)
        } catch (e) {
            console.log(e)
        }
        let highlightArray = []
        entity.entities && entity.entities.forEach(element => {
            console.log(element)
            let selectedText = element[2]
            highlightArray.push(selectedText)
        });
        return highlightArray
    }
    render() {
        const papaparseOptions = {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            transformHeader: header =>
                header
                    .toLowerCase()
                    .replace(/\W/g, '_')
        }
        const { entityArray, showCard, jsonToCSV } = { ...this.state }

        return (
            <div>

                <CSVReader
                    cssClass="csv-reader-input "
                    onFileLoaded={file => this.setState({ jsonToCSV: file })}
                    onError={error => { console.log(error) }}
                    parserOptions={papaparseOptions}
                    inputId="ObiWan"
                    inputStyle={{ color: 'red', display: "none" }}
                    inputRef={this.fileInput}
                />
                <div className="card text-center">
                    <div className="card-header">
                        Annotated Data
                    </div>

                    <div className="card-body">

                        <div>
                            <span className="text-center"> Table Name</span>
                            <button className="btn btn-primary float-right ml-1"
                                onClick={e => { this.setState({ showCard: !showCard }) }}>New Annotation</button>
                            <button className="btn btn-success mr-1 float-right " onClick={e => document.getElementById('ObiWan').click()}>Upload CSV <i class="fas fa-upload"></i></button>

                        </div>
                        <hr className="text-white" />

                        <table className="table-editable table-hover">
                            <thead>
                                <tr>
                                    <th>S.NO</th>
                                    <th>train</th>
                                    <th>entity</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jsonToCSV.map((data, index) =>
                                    <tr key={index} >
                                        <td>{index + 1}</td>
                                        <td className="wrap text-truncate  p-4">{data.train}</td>
                                        <td className="wrap text-truncate  p-4">  {data.entity}
                                            {/* <Highlighter
                                                highlightClassName="YourHighlightClass"
                                                searchWords={this.getHighlightedWord(data)}
                                                autoEscape={true}
                                                textToHighlight={data.train}
                                            /> */}
                                        </td>
                                        <td>
                                            <i className="fas fa-edit c-pointer text-success" onClick={e => { this.editTable(data) }}></i>
                                            <i className="fas fa-minus-circle c-pointer text-danger ml-1" onClick={e => { this.removeRow("jsonToCSV", index) }}></i></td>
                                    </tr>
                                )}

                            </tbody>
                        </table>
                    </div>

                    <div className="card-footer text-muted">
                        <button className="btn btn-dark mr-2 float-right">
                            <CSVLink data={jsonToCSV} >
                                <span className="c-pointer" >Save Local <i className="fas fa-download ml-1" ></i></span>
                            </CSVLink>
                        </button>
                    </div>
                </div>

                <Popup open={showCard} position="right center">
                    <div className='popup'>
                        <div className="card">
                            <div className="card text-center">
                                <div className="card-header text-left">
                                    <i className="fas fa-folder-open fa-1x"></i>
                                    <span className="ml-2">Create Intent</span>
                                </div>
                            </div>
                            <div className="popup_inner popup-body large-popup popup-card-body w-50">
                                <span className="font-weight-bold" >Text Annotation</span>
                                <span className="list-inline float-right" onClick={e => { this.setState({ showCard: false }) }}> <i className="fas fa-times-circle fa-2x text-danger c-pointer"></i>
                                </span>
                                {/* <div className="clearfix">dsfsdfsdfsdfsdfsdf</div> */}
                                <div className="text-primary ">
                                    <form>
                                        <div className="card-body">
                                            <div className="md-form text-left">
                                                <label htmlFor="inputLGEx">Text Input</label>
                                                <input type="text" id="inputLGEx" name="textField" value={this.state.textField} className="form-control form-control-lg" onChange={e => { this.handleChange(e) }} />
                                            </div>

                                            <div className="form-inline mt-3  ">
                                                <label htmlFor="selecEntity">Select entity :</label>
                                                <textarea rows="4" cols="10" wrap="soft" className=" text-primary form-control col-md-10 hiddenInput" id="selecEntity" onSelect={e => this.selectedText(e)} readOnly value={this.state.textField} />
                                            </div>
                                        </div>
                                        {entityArray.length > 0 ? <table className="table-editable table-hover">
                                            <thead>
                                                <tr>
                                                    <th>S.NO</th>
                                                    <th>Value</th>
                                                    <th>entity</th>
                                                    <th>Start</th>
                                                    <th>End</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {entityArray.map((entity, index) =>
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td className="wrap text-truncate p-4" >{entity.value}</td>
                                                        <td className="wrap   p-4" contentEditable="true" onInput={e => { this.changeEntityValue(e, index) }}  >{entity.tempEntity}</td>
                                                        <td>{entity.start}</td>
                                                        <td>{entity.end}</td>
                                                        <td> <i className="fas fa-minus-circle c-pointer text-danger" onClick={e => { this.removeRow('entityArray', index) }}></i></td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table> : null}

                                    </form>
                                    <button className="btn btn-success mr-2 float-right mt-2" onClick={e => this.sumitValues(e)}> Submit</button>
                                </div>

                            </div>

                        </div>
                    </div>
                </Popup>
                <ToastContainer />

            </div>
        );
    }
}

export default homeComponent;