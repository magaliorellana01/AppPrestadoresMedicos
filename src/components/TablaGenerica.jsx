import React from "react";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    IconButton,
    Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import Box from '@mui/material/Box'


function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}

export default function TablaGenerica({
    columns,
    rows,
    count,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
    onSelect,
    keyFor,
    sxContainer = {},
}) {

    const headerBgColor = '#f5f7f9';
    const tableContainerBgColor = '#E5E7EB'; 
    const oddRowBgColor = tableContainerBgColor;
    const hoverColor = "#FFFFFF";

    return (
        <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden", backgroundColor: tableContainerBgColor, ...sxContainer }}>
            <TableContainer>
                <Table
                    stickyHeader
                    sx={{
                        tableLayout: "fixed",
                        width: "100%",
                        "& th": {
                            fontSize: { xs: "0.875rem", sm: "0.95rem" },
                            fontWeight: 600,
                            backgroundColor: headerBgColor,
                            color: '#4a4a4a',
                            boxShadow: "none",
                            borderBottom: '1px solid #e0e0e0',
                            py: { xs: 1.5, sm: 2 },
                        },
                        "& td": {
                            fontSize: { xs: "0.875rem", sm: "0.95rem" },
                            py: { xs: 1.5, sm: 2 },
                            color: '#333',
                            borderBottom: '1px solid #f0f0f0',
                        },
                    }}
                >
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align || 'left'}
                                    style={{ width: column.width || 'auto' }}
                                    sx={column.sxHeader || {}}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center" sx={{ color: "text.secondary" }}>
                                    No hay resultados.
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows.map((item, index) => (
                                <TableRow
                                    key={keyFor ? keyFor(item) : index}
                                    hover
                                    onClick={() => onSelect?.(item)}
                                    sx={{
                                        cursor: onSelect ? "pointer" : "default",
                                        transition: "background-color .15s ease",
                                        "&:nth-of-type(odd)": { backgroundColor: oddRowBgColor },
                                        "&:hover": { backgroundColor: hoverColor },
                                        "&:last-child td, &:last-child th": { border: 0 },
                                    }}
                                >
                                    {columns.map((column) => (
                                        <TableCell
                                            key={`${column.id}-${keyFor ? keyFor(item) : index}`}
                                            align={column.align || 'left'}
                                            sx={column.sxCell || {}}
                                        >
                                            {column.renderCell
                                                ? column.renderCell(item, item[column.id])
                                                : item[column.id]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={count}
                page={page}
                onPageChange={onPageChange}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={onRowsPerPageChange}
                rowsPerPageOptions={[5, 10, 25, 50]}
                labelRowsPerPage="Filas por página"
                ActionsComponent={TablePaginationActions}
                sx={{
                    "& .MuiTablePagination-toolbar": {
                        pr: { xs: 1, sm: 2 },
                        "& .MuiIconButton-root": {
                            color: theme => theme.palette.primary.main,
                            opacity: 0.8,
                            "&:hover": {
                                backgroundColor: 'rgba(0,0,0,0.04)',
                            }
                        },
                        "& .MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
                            color: '#555',
                            fontSize: '0.875rem',
                        }
                    },
                    "& .MuiInputBase-root": {
                        fontSize: '0.875rem',
                        color: '#555',
                    }
                }}
            />
        </Paper>
    );
}