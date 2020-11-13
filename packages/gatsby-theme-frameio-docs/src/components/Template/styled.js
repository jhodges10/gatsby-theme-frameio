import styled from '@emotion/styled';
import { HEADER_HEIGHT } from '../../utils';
import { colors, smallCaps } from 'gatsby-theme-apollo-core';

export const TableWrapper = styled.div({
    overflow: 'auto',
    marginBottom: '1.45rem'
});

const tableBorder = `1px solid ${colors.divider}`;
export const StyledTable = styled.table({
    border: tableBorder,
    borderSpacing: 0,
    borderRadius: 4,
    [['th', 'td']]: {
        padding: 16,
        borderBottom: tableBorder
    },
    'tbody tr:last-child td': {
        border: 0
    },
    th: {
        ...smallCaps,
        fontSize: 13,
        fontWeight: 'normal',
        color: colors.text2,
        textAlign: 'inherit'
    },
    td: {
        verticalAlign: 'top',
        p: {
            fontSize: 'inherit',
            lineHeight: 'inherit'
        },
        code: {
            whiteSpace: 'normal'
        },
        '> :last-child': {
            marginBottom: 0
        }
    },
    '&.field-table': {
        td: {
            h6: {
                fontSize: 'inherit',
                lineHeight: 'inherit',
                fontWeight: 'bold',
                marginBottom: '5px',
                paddingTop: (HEADER_HEIGHT + 20),
                marginTop: -(HEADER_HEIGHT + 20)
            },
            '&:first-child p': {
                fontSize: '14px',
                code: {
                    color: colors.tertiary
                }
            }
        },
        'tr.required td': {
            background: colors.background
        }
    }
});
