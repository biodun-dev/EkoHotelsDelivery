import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { strings } from "../locales/i18n";
import EDButton from "./EDButton";
import EDRTLView from "./EDRTLView";
import { debugLog, getProportionalFontSize } from "../utils/EDConstants";
import { EDColors } from "../utils/EDColors";
import { EDFonts } from "../utils/EDFontConstants";
import metrics from "../utils/metrics";
import moment from "moment";
import DateTimePicker from '@react-native-community/datetimepicker';

export default class EDTimePicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(), // Current date
            showPicker: false, // To show/hide DateTimePicker
        };
    }

    componentDidMount() {
        this.setValue();
    }

    setValue = () => {
        if (this.props.value) {
            const parsedDate = moment(this.props.value, "hh:mm A").toDate();
            this.setState({ date: parsedDate });
        }
    };

    onChange = (event, selectedDate) => {
        if (selectedDate) {
            this.setState({ date: selectedDate, showPicker: false });
        } else {
            this.setState({ showPicker: false }); // Close picker if canceled
        }
    };

    render() {
        return (
            <View style={styles.timePickerMainView}>
                <View style={styles.timePickerSubView}>
                    <View style={styles.pickerText}>
                        <Text style={styles.titleText}>{strings("selectTime")}</Text>
                    </View>
                    <EDRTLView style={styles.timePickerView}>
                        <EDButton
                            label={moment(this.state.date).format("hh:mm A")}
                            onPress={() => this.setState({ showPicker: true })}
                            style={styles.spinerStyle}
                        />
                        {this.state.showPicker && (
                            <DateTimePicker
                                value={this.state.date}
                                mode="time"
                                is24Hour={false}
                                display="spinner"
                                onChange={this.onChange}
                            />
                        )}
                    </EDRTLView>
                    <EDRTLView style={{ margin: 8, backgroundColor: EDColors.white }}>
                        <EDButton
                            label={strings("dialogConfirm")}
                            onPress={this.onConfirm}
                            style={styles.confirmButton}
                            textStyle={styles.confirmText}
                        />
                        <EDButton
                            label={strings("dialogCancel")}
                            onPress={this.onCancel}
                            style={styles.cancelButton}
                            textStyle={styles.cancelText}
                        />
                    </EDRTLView>
                </View>
            </View>
        );
    }

    onConfirm = () => {
        const timePicked = moment(this.state.date).format("hh:mm A");
        this.setState({ eventTime: timePicked });
        if (this.props.onConfirm) this.props.onConfirm(timePicked);
    };

    onCancel = () => {
        if (this.props.onCancel) this.props.onCancel();
    };
}

const styles = StyleSheet.create({
    timePickerMainView: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    spinerStyle: { flex: 1, backgroundColor: 'white' },
    timePickerView: { justifyContent: 'space-evenly', alignItems: 'center', marginHorizontal: 70, marginBottom: 30 },
    timePickerSubView: { backgroundColor: EDColors.white, width: '90%', borderRadius: 24, paddingVertical: 10 },
    pickerText: { alignSelf: 'center', marginBottom: 25, marginTop: 10 },
    confirmButton: { flex: 1, borderRadius: 16, backgroundColor: EDColors.primary, height: metrics.screenHeight * 0.075, marginHorizontal: 10 },
    cancelButton: { flex: 1, borderRadius: 16, backgroundColor: EDColors.offWhite, height: metrics.screenHeight * 0.075, marginHorizontal: 10 },
    confirmText: { fontFamily: EDFonts.medium, color: EDColors.white, fontSize: getProportionalFontSize(16) },
    cancelText: { fontFamily: EDFonts.medium, color: EDColors.black, fontSize: getProportionalFontSize(16) },
    timeText: { fontSize: getProportionalFontSize(16), fontFamily: EDFonts.medium, color: EDColors.black },
    titleText: { fontSize: getProportionalFontSize(16), fontFamily: EDFonts.semiBold, color: EDColors.black },
});
