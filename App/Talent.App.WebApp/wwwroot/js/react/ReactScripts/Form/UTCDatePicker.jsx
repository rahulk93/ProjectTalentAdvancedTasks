import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

export class UTCDatePicker extends React.Component {
    constructor(props) {
        super(props);

        this.convertLocalToUTCDate = this.convertLocalToUTCDate.bind(this);
        this.convertUTCToLocalDate = this.convertUTCToLocalDate.bind(this);
    };

    convertUTCToLocalDate(date) {
        if (!date) {
            return date;
        }
        const zuluOffset = new Date(date).getTimezoneOffset() * 60 * 1000;
        const localTimestamp = new Date(date).getTime() + zuluOffset;
        const adjustedDate = new Date(localTimestamp);
        return adjustedDate;
    }

    convertLocalToUTCDate(date) {
        const zuluOffset = new Date(date).getTimezoneOffset() * 60 * 1000;
        const zuluTimestamp = new Date(date).getTime() - zuluOffset;
        const adjustedDate = new Date(zuluTimestamp);
        return adjustedDate;
    }

    render() {
        const dateLocal = this.convertUTCToLocalDate(this.props.selected);
        const dateMoment = dateLocal ? moment(dateLocal) : null;
        return (
            <DatePicker
                selected={dateMoment}
                onChange={date => this.props.onChange(this.convertLocalToUTCDate(date))}
            />
        )
    }
}