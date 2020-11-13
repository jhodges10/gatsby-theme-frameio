import React from 'react';
import { TableWrapper, StyledTable } from './styled';

export default function CustomTable(props) {
    return (
        <TableWrapper>
            <StyledTable {...props} />
        </TableWrapper>
    );
}
