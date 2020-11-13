import React from 'react';

export default function CustomTable(props) {
    return (
        <TableWrapper>
            <StyledTable {...props} />
        </TableWrapper>
    );
}
