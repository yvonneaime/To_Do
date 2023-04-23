import {Component} from "react";

export class ErrorDisplay extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <div>{this.props.errorMessage}</div>;
    }
}

export function invalidate(property, setter, timeout){
    if (!property){
        setter(!property)
    }
}
