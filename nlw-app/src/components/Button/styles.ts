import { StyleSheet } from 'react-native';
import { FONTS } from '../../theme';

export const styles = StyleSheet.create({
    button: {
        height: 50,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

    },
    title: {
        fontSize: 14,
        fontFamily: FONTS.BOLD

    },
    icon: {
        marginRight: 12,
    }
});