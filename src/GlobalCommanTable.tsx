import * as React from 'react';
import {
    Column,
    Table,
    ExpandedState,
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getExpandedRowModel,
    flexRender,
    ColumnFiltersState,
    getSortedRowModel,
    SortingState,
    FilterFn,
    getPaginationRowModel,
    Row
} from "@tanstack/react-table";
import { useVirtualizer, notUndefined } from "@tanstack/react-virtual";
import { RankingInfo, rankItem, compareItems } from "@tanstack/match-sorter-utils";
import { FaSearch, FaSort, FaSortDown, FaSortUp, FaChevronRight, FaChevronLeft, FaAngleDoubleRight, FaAngleDoubleLeft, FaInfoCircle, FaPlus, FaMinus } from 'react-icons/fa';
import { HTMLProps } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from "xlsx";
import { saveAs } from 'file-saver';
import { RiFileExcel2Fill } from 'react-icons/ri';
// import SelectFilterPanel from './selectFilterPannel';
import { SlArrowDown, SlArrowRight, SlArrowUp } from 'react-icons/sl';

// ReactTable Part/////
declare module "@tanstack/table-core" {
    interface FilterFns {
        fuzzy: FilterFn<unknown>
        ;
    }
    interface FilterMeta {
        itemRank: RankingInfo;
    }
}
const fuzzyFilter: FilterFn<any>
    = (row, columnId, value, addMeta) => {
        // Rank the item
        const itemRank = rankItem(row.getValue(columnId), value);

        // Store the itemRank info
        addMeta({
            itemRank
        });

        // Return if the item should be filtered in/out
        return itemRank.passed;
    };

///Global Filter Parts//////
// A debounced input react component
function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    portfolioColor,
    ...props
}: {
    value: string | number;
    onChange: (value: string | number) => void;
    debounce?: number;
    portfolioColor: any
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
    const [value, setValue] = React.useState(initialValue);

    React.useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value);
        }, debounce);

        return () => clearTimeout(timeout);
    }, [value]);

    return (
        <>
            <div className="container-2 mx-1">
                <span className="icon">
                    <svg style={{ fill: `${portfolioColor}` }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="18px" height="18px"><path d="M 19 3 C 13.488281 3 9 7.488281 9 13 C 9 15.394531 9.839844 17.589844 11.25 19.3125 L 3.28125 27.28125 L 4.71875 28.71875 L 12.6875 20.75 C 14.410156 22.160156 16.605469 23 19 23 C 24.511719 23 29 18.511719 29 13 C 29 7.488281 24.511719 3 19 3 Z M 19 5 C 23.429688 5 27 8.570313 27 13 C 27 17.429688 23.429688 21 19 21 C 14.570313 21 11 17.429688 11 13 C 11 8.570313 14.570313 5 19 5 Z" /></svg>
                </span>
                <input type="search" id="search" {...props}
                    value={value}
                    onChange={(e) => setValue(e.target.value)} />
            </div>
        </>
    );
}



export function Filter({
    column,
    table,
    placeholder
}: {
    column: Column<any, any>;
    table: Table<any>;
    placeholder: any
}): any {
    const columnFilterValue = column.getFilterValue();
    // style={{ width: placeholder?.size }}
    return (
        <><input style={{ width: "100%" }} className="me-1 my-1 mx-1 on-search-cross pe-10"
            // type="text"
            title={placeholder?.placeholder}
            type="search"
            value={(columnFilterValue ?? "") as string}
            onChange={(e) => column.setFilterValue(e.target.value)}
            placeholder={`${placeholder?.placeholder}`} /><span className="searchClear" onClick={() => column.setFilterValue("")}></span></>
    );
}

export function IndeterminateCheckbox(
    {
        indeterminate,
        className = "",
        ...rest
    }: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
    const ref = React.useRef<HTMLInputElement>(null!);
    React.useEffect(() => {
        if (typeof indeterminate === "boolean") {
            ref.current.indeterminate = !rest.checked && indeterminate;
        }
    }, [ref, indeterminate]);
    return (
        <input
            type="checkbox"
            ref={ref}
            className={className + "form-check-input cursor-pointer"}
            {...rest}
        />
    );
}

// ********************* function with globlize Expended And Checkbox*******************
let forceExpanded: any = [];
const getFirstColHeader = ({ hasCheckbox, hasExpanded, isHeaderNotAvlable }: any) => {
    return ({ table }: any) => (
        <>
            {hasExpanded && isHeaderNotAvlable != true && (<>
                <span className="border-0 bg-Ff" {...{ onClick: table.getToggleAllRowsExpandedHandler(), }}>
                    {table.getIsAllRowsExpanded() ? (
                        <SlArrowDown title='Tap to collapse the childs' />) : (<SlArrowRight title='Tap to expand the childs' />)}
                </span>{" "}
            </>)}
            {hasCheckbox && (
                <span style={hasExpanded ? { marginLeft: '7px', marginBottom: '5px' } : {}} ><IndeterminateCheckbox className="mx-1 " {...{ checked: table.getIsAllRowsSelected(), indeterminate: table.getIsSomeRowsSelected(), onChange: table.getToggleAllRowsSelectedHandler(), }} />{" "}</span>
            )}
        </>
    );
};

const getFirstColCell = ({ setExpanded, hasCheckbox, hasCustomExpanded, hasExpanded }: any) => {
    return ({ row, getValue, table }: any) => (
        <div className="alignCenter">
            {hasExpanded && row.getCanExpand() && (
                <div className="border-0 alignCenter" {...{ onClick: row.getToggleExpandedHandler(), style: { cursor: "pointer" }, }}>
                    {row.getIsExpanded() ? <SlArrowDown title={'collapse ' + `${row.original.Title}` + ' childs'} style={{ color: `${row?.original?.PortfolioType?.Color}` }} /> : <SlArrowRight title={'Expand' + `${row.original.Title}` + 'childs'} style={{ color: `${row?.original?.PortfolioType?.Color}` }} />}
                </div>
            )}{" "}
            {hasCheckbox && (
                <span style={{ marginLeft: hasExpanded && row.getCanExpand() ? '11px' : hasExpanded !== true ? '0px' : '25px' }}> <IndeterminateCheckbox {...{ checked: row.getIsSelected(), indeterminate: row.getIsSomeSelected(), onChange: row.getToggleSelectedHandler(), }} />{" "}</span>
            )}
            {hasCustomExpanded && <div>
                {((row.getCanExpand() &&
                    row.subRows?.length !== row.original.subRows?.length) ||
                    !row.getCanExpand() ||
                    forceExpanded.includes(row.id)) &&
                    row.original.subRows?.length ? (
                    <div className="mx-1 alignCenter"
                        {...{
                            onClick: () => {
                                if (!forceExpanded.includes(row.id)) {
                                    const coreIds = table.getCoreRowModel().rowsById;
                                    row.subRows = coreIds[row.id].subRows;
                                    const rowModel = table.getRowModel();
                                    const updateRowModelRecursively = (item: any) => {
                                        item.subRows?.forEach((elem: any) => {
                                            if (!rowModel.rowsById[elem.id]) {
                                                rowModel.flatRows.push(elem);
                                                rowModel.rowsById[elem.id] = elem;
                                            }
                                            elem?.subRows?.length &&
                                                updateRowModelRecursively(elem);
                                        });
                                    }
                                    updateRowModelRecursively(row);
                                    const temp = Object.keys(coreIds).filter(
                                        (item: any) =>
                                            item === row.id ||
                                            item.startsWith(row.id + ".")
                                    );
                                    forceExpanded = [...forceExpanded, ...temp];
                                    setExpanded((prev: any) => ({
                                        ...prev,
                                        [row.id]: true,
                                    }));
                                } else {
                                    row.getToggleExpandedHandler()();
                                }
                            },
                            style: { cursor: "pointer" },
                        }}
                    >
                        {!row.getCanExpand() ||
                            (row.getCanExpand() &&
                                row.subRows?.length !== row.original.subRows?.length)
                            ? <FaPlus style={{ fontSize: '10px', color: `${row?.original?.PortfolioType?.Color}` }} />
                            : row.getIsExpanded()
                                ? <FaMinus style={{ color: `${row?.original?.PortfolioType?.Color}` }} />
                                : <FaPlus style={{ fontSize: '10px', color: `${row?.original?.PortfolioType?.Color}` }} />}
                    </div>
                ) : (
                    ""
                )}{" "}
            </div>}
            {getValue()}
        </div>
    );
};
// ********************* function with globlize Expended And Checkbox*******************


// ReactTable Part end/////
let isShowingDataAll: any = false;
const GlobalCommanTable = (items: any, ref: any) => {
    let childRefdata: any;
    const childRef = React.useRef<any>();
    if (childRef != null) {
        childRefdata = { ...childRef };

    }
    let AllItems: any = [];
    let expendedTrue = items?.expendedTrue
    let data = items?.data;
    let columns = items?.columns;
    let callBackData = items?.callBackData;
    let callBackDataToolTip = items?.callBackDataToolTip;
    let pageName = items?.pageName;
    let siteUrl: any = '';
    let showHeader = items?.showHeader;
    let showPagination: any = items?.showPagination;
    let usedFor: any = items?.usedFor;
    let portfolioColor = items?.portfolioColor;
    let expandIcon = items?.expandIcon;
    let fixedWidth = items?.fixedWidth;
    let portfolioTypeData = items?.portfolioTypeData;
    let showingAllPortFolioCount = items?.showingAllPortFolioCount
    const [wrapperHeight, setWrapperHeight] = React.useState(items?.wrapperHeight?.length > 0 ? items?.wrapperHeight : "");
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    );
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [expanded, setExpanded] = React.useState<ExpandedState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [ShowTeamPopup, setShowTeamPopup] = React.useState(false);
    const [showTeamMemberOnCheck, setShowTeamMemberOnCheck] = React.useState(false)
    const [globalSearchType, setGlobalSearchType] = React.useState("ALL");
    const [selectedFilterPanelIsOpen, setSelectedFilterPanelIsOpen] = React.useState(false);
    const [tablecontiner, settablecontiner]: any = React.useState("hundred");
    const [trueRestructuring, setTrueRestructuring] = React.useState(false);
    const [columnVisibility, setColumnVisibility] = React.useState({ descriptionsSearch: false, commentsSearch: false });
    const [selectedFilterPannelData, setSelectedFilterPannelData] = React.useState({
        Title: { Title: 'Title', Selected: true },
        commentsSearch: { commentsSearch: 'commentsSearch', Selected: true },
        descriptionsSearch: { descriptionsSearch: 'descriptionsSearch', Selected: true },
    });
    const customGlobalSearch = (row: any, id: any, query: any) => {
        query = query.replace(/\s+/g, " ").trim()?.toLowerCase();
        if (String(query).trim() === "") return true;

        if ((selectedFilterPannelData?.Title?.Title === id && selectedFilterPannelData?.Title?.Selected === true) || (selectedFilterPannelData?.commentsSearch?.commentsSearch === id && selectedFilterPannelData?.commentsSearch?.Selected === true) ||
            (selectedFilterPannelData?.descriptionsSearch?.descriptionsSearch === id && selectedFilterPannelData?.descriptionsSearch?.Selected === true)) {

            const cellValue: any = String(row.getValue(id))?.toLowerCase();

            if (globalSearchType === "ALL") {
                let found = true;
                let a = query?.split(" ")
                for (let item of a) {
                    if (!cellValue.split(" ").some((elem: any) => elem === item)) {
                        found = false;
                    }
                }
                return found
            } else if (globalSearchType === "ANY") {
                for (let item of query.split(" ")) {
                    if (cellValue.includes(item)) return true;
                }
                return false;
            } else if (globalSearchType === "EXACT") {
                return cellValue.includes(query);
            }
        };
    };

    // ***************** coustmize Global Expende And Check Box *********************
    const modColumns = React.useMemo(() => {
        return columns.map((elem: any, index: any) => {
            elem.header = elem.header || "";
            if (index === 0) {
                elem = {
                    ...elem,
                    header: getFirstColHeader({
                        hasCheckbox: elem.hasCheckbox,
                        hasExpanded: elem.hasExpanded,
                        isHeaderNotAvlable: elem.isHeaderNotAvlable
                    }),
                    cell: getFirstColCell({
                        setExpanded,
                        hasExpanded: elem.hasExpanded,
                        hasCheckbox: elem.hasCheckbox,
                        hasCustomExpanded: elem.hasCustomExpanded,
                    }),
                };
            }
            return elem;
        });
    }, [columns]);
    // ***************** coustmize Global Expende And Check Box End *****************

    const selectedFilterCallBack = React.useCallback((item: any) => {
        if (item != undefined) {
            setSelectedFilterPannelData(item)
        }
        setSelectedFilterPanelIsOpen(false)
    }, []);

    const table: any = useReactTable({
        data,
        columns: modColumns,
        filterFns: {
            fuzzy: fuzzyFilter
        },
        state: {
            globalFilter,
            columnFilters,
            expanded,
            sorting,
            rowSelection,
            columnVisibility
        },
        onSortingChange: setSorting,
        enableMultiRowSelection: items?.multiSelect === false ? items?.multiSelect : true,
        onColumnFiltersChange: setColumnFilters,
        onExpandedChange: setExpanded,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: fuzzyFilter,
        getSubRows: (row: any) => row?.subRows,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: showPagination === true ? getPaginationRowModel() : undefined,
        getFilteredRowModel: getFilteredRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugTable: true,
        filterFromLeafRows: true,
        enableSubRowSelection: false,
        // filterFns: undefined
    });
    /****************** defult sorting  part *******************/
    React.useEffect(() => {
        if (columns?.length > 0 && columns != undefined) {
            let sortingDescData: any = [];
            columns.map((sortDec: any) => {
                if (sortDec.isColumnDefultSortingDesc === true) {
                    let obj = { 'id': sortDec.id, desc: true }
                    sortingDescData.push(obj);
                } else if (sortDec.isColumnDefultSortingAsc === true) {
                    let obj = { 'id': sortDec.id, desc: false }
                    sortingDescData.push(obj)
                }
            })
            if (sortingDescData.length > 0) {
                setSorting(sortingDescData);
            }
        }
    }, [])
    /****************** defult sorting  part end *******************/

    React.useEffect(() => {
        CheckDataPrepre()
    }, [table?.getSelectedRowModel()?.flatRows])
    React.useEffect(() => {
        if (items?.pageSize != undefined) {
            table.setPageSize(items?.pageSize)
        } else {
            table.setPageSize(100);
        }
        table.setPageSize(100);
    }, [])
    let item: any;
    let ComponentCopy: any = 0;
    let SubComponentCopy: any = 0;
    let FeatureCopy: any = 0;
    let FilterShowhideShwingData: any = false;
    let AfterSearch = table?.getRowModel()?.rows;
    React.useEffect(() => {
        if (columnFilters.length > 0 || globalFilter.length > 0) {
            if (AfterSearch != undefined && AfterSearch.length > 0) {
                AfterSearch?.map((Comp: any) => {
                    if (Comp.columnFilters.Title == true || Comp.columnFilters.PortfolioStructureID == true || Comp.columnFilters.ClientCategory == true || Comp.columnFilters.TeamLeaderUser == true || Comp.columnFilters.PercentComplete == true || Comp.columnFilters.ItemRank == true || Comp.columnFilters.DueDate == true) {
                        FilterShowhideShwingData = true;
                    }
                    if (Comp.original != undefined) {
                        if (Comp?.original?.Item_x0020_Type == "Component") {
                            ComponentCopy = ComponentCopy + 1
                        }
                        if (Comp?.original?.Item_x0020_Type == "SubComponent") {
                            SubComponentCopy = SubComponentCopy + 1;
                        }
                        if (Comp?.original?.Item_x0020_Type == "Feature") {
                            FeatureCopy = FeatureCopy + 1;
                        }
                    }
                })
            }
            let ShowingData = { ComponentCopy: ComponentCopy, SubComponentCopy: SubComponentCopy, FeatureCopy: FeatureCopy, FilterShowhideShwingData: FilterShowhideShwingData }
            callBackData(item, ShowingData)
        }
    }, [table?.getRowModel()?.rows])

    React.useEffect(() => {
        if (AfterSearch != undefined && AfterSearch.length > 0) {
            portfolioTypeData?.filter((count: any) => { count[count.Title + 'numberCopy'] = 0 })
            items?.taskTypeDataItem?.filter((taskLevelcount: any) => { taskLevelcount[taskLevelcount.Title + 'numberCopy'] = 0 })
            AfterSearch?.map((Comp: any) => {
                if (columnFilters.length > 0 || globalFilter.length > 0) {
                    isShowingDataAll = true;
                    portfolioTypeData?.map((type: any) => {
                        if (Comp?.original?.Item_x0020_Type === type.Title) {
                            type[type.Title + 'numberCopy'] += 1;
                            type.FilterShowhideShwingData = true;
                        }
                    })
                    items?.taskTypeDataItem?.map((taskLevel: any) => {
                        if (Comp?.original?.TaskType?.Title === taskLevel.Title) {
                            taskLevel[taskLevel.Title + 'numberCopy'] += 1;
                            taskLevel.FilterShowhideShwingData = true;
                        }
                    })
                } else {
                    isShowingDataAll = false;
                    portfolioTypeData?.map((type: any) => {
                        if (type.Title + 'numberCopy' != undefined) {
                            type[type.Title + 'numberCopy'] = 0;
                            type.FilterShowhideShwingData = false;
                        }
                    })
                    items?.taskTypeDataItem?.map((taskLevel: any) => {
                        if (taskLevel.Title + 'numberCopy' != undefined) {
                            taskLevel[taskLevel.Title + 'numberCopy'] = 0;
                            taskLevel.FilterShowhideShwingData = false;
                        }
                    })
                }
            })
        } else {
            portfolioTypeData?.filter((count: any) => { count[count.Title + 'numberCopy'] = 0 })
            items?.taskTypeDataItem?.filter((taskLevelcount: any) => { taskLevelcount[taskLevelcount.Title + 'numberCopy'] = 0 })
            isShowingDataAll = true;
        }
    }, [table?.getRowModel()?.rows])



    const CheckDataPrepre = () => {
        let itrm: any;
        let parentData: any;
        let parentDataCopy: any;
        if (usedFor == "SiteComposition" || items?.multiSelect === true) {
            let finalData: any = table?.getSelectedRowModel()?.flatRows;
            callBackData(finalData);
        } else {
            if (table?.getSelectedRowModel()?.flatRows.length > 0) {
                restructureFunct(true);
                table?.getSelectedRowModel()?.flatRows?.map((elem: any) => {
                    if (elem?.getParentRows() != undefined) {
                        // parentData = elem?.parentRow;
                        // parentDataCopy = elem?.parentRow?.original
                        parentDataCopy = elem?.getParentRows()[0]?.original;
                        // if (parentData != undefined && parentData?.parentRow != undefined) {

                        //     parentData = elem?.parentRow?.parentRow
                        //     parentDataCopy = elem?.parentRow?.parentRow?.original

                        //     if (parentData != undefined && parentData?.parentRow != undefined) {

                        //         parentData = elem?.parentRow?.parentRow?.parentRow
                        //         parentDataCopy = elem?.parentRow?.parentRow?.parentRow?.original
                        //     }
                        //     if (parentData != undefined && parentData?.parentRow != undefined) {

                        //         parentData = elem?.parentRow?.parentRow?.parentRow?.parentRow
                        //         parentDataCopy = elem?.parentRow?.parentRow?.parentRow?.parentRow?.original
                        //     }
                        //     if (parentData != undefined && parentData?.parentRow != undefined) {

                        //         parentData = elem?.parentRow?.parentRow?.parentRow?.parentRow?.parentRow
                        //         parentDataCopy = elem?.parentRow?.parentRow?.parentRow?.parentRow?.parentRow?.original
                        //     }
                        //     if (parentData != undefined && parentData?.parentRow != undefined) {
                        //         parentData = elem?.parentRow?.parentRow?.parentRow?.parentRow?.parentRow?.parentRow
                        //         parentDataCopy = elem?.parentRow?.parentRow?.parentRow?.parentRow?.parentRow?.parentRow?.original
                        //     }
                        // }
                    }
                    if (parentDataCopy) {
                        elem.original.parentDataId = parentDataCopy
                    }
                    elem.original.Id = elem.original.ID
                    item = elem.original;
                    AllItems.push(item);
                });
                callBackData(AllItems)
            } else {
                restructureFunct(false)
                callBackData(item)
            }
            console.log("itrm", item)
        }
    }
    const ShowTeamFunc = () => {
        setShowTeamPopup(true)
    }
    const showTaskTeamCAllBack = React.useCallback(() => {
        setShowTeamPopup(false)
    }, []);
    const openTaskAndPortfolioMulti = () => {
        table?.getSelectedRowModel()?.flatRows?.map((item: any) => {
            let siteUrl: any = ''
            if (item?.original?.siteUrl != undefined) {
                siteUrl = item?.original?.siteUrl;
            } else {
                siteUrl = items?.AllListId?.siteUrl;
            }
            if (item?.original?.siteType === "Master Tasks") {
                window.open(`${siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${item?.original?.Id}`, '_blank')
            } else if (item?.original?.siteType === "Project") {
                window.open(`${siteUrl}/SitePages/Project-Management.aspx?taskId=${item?.original?.Id}`, '_blank')
            } else {
                window.open(`${siteUrl}/SitePages/Task-Profile.aspx?taskId=${item?.original?.Id}&Site=${item?.original?.siteType}`, '_blank')
            }
        })
    }
    // React.useEffect(() => {
    //     if (expendedTrue != true) {
    //         if (table.getState().columnFilters.length || table.getState()?.globalFilter?.length > 0) {
    //             setExpanded(true);
    //         } else {
    //             setExpanded({});
    //         }
    //     }
    // }, [table.getState().columnFilters, table.getState().globalFilter]);

    React.useEffect(() => {
        if (expendedTrue != true) {
            if (table.getState().columnFilters.length || table.getState()?.globalFilter?.length > 0) {
                const allKeys = Object.keys(table.getFilteredRowModel().rowsById).reduce(
                    (acc: any, cur: any) => {
                        if (table.getFilteredRowModel().rowsById[cur].subRows?.length) {
                            acc[cur] = true;
                        }
                        return acc;
                    },
                    {}
                );
                setExpanded(allKeys);
            } else {
                setExpanded({});
            }
            forceExpanded = [];
        }
    }, [table.getState().columnFilters, table.getState().globalFilter]);


    React.useEffect(() => {
        if (expendedTrue === true) {
            setExpanded(true);
        } else {
            setExpanded({});
        }
    }, []);

    React.useEffect(() => {
        if (pageName === 'hierarchyPopperToolTip') {
            callBackDataToolTip(expanded);
        }
    }, [expanded])

    // Print ANd Xls Parts//////
    const downloadPdf = () => {
        const doc = new jsPDF({ orientation: 'landscape' });
        autoTable(doc, {
            html: '#my-table'
        })
        doc.save('Data PrintOut');
    }

    // Export To Excel////////
    const exportToExcel = () => {
        const flattenedData: any[] = [];
        const flattenRowData = (row: any) => {
            const flattenedRow: any = {};
            columns.forEach((column: any) => {
                if (column.placeholder != undefined && column.placeholder != '') {
                    flattenedRow[column.id] = row.original[column.id];
                }
            });
            flattenedData.push(flattenedRow);
            if (row.getCanExpand()) {
                row.subRows.forEach(flattenRowData);
            }
        };
        table.getRowModel().rows.forEach(flattenRowData);
        const worksheet: any = XLSX.utils.aoa_to_sheet([]);
        XLSX.utils.sheet_add_json(worksheet, flattenedData, {
            skipHeader: false,
            origin: "A1",
        });
        const maxLength = 32767;
        const sheetRange = XLSX.utils.decode_range(worksheet["!ref"]);
        for (let R = sheetRange.s.r; R <= sheetRange.e.r; ++R) {
            for (let C = sheetRange.s.c; C <= sheetRange.e.c; ++C) {
                const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                const cell = worksheet[cellAddress];
                if (cell && cell.t === "s" && cell.v.length > maxLength) {
                    const chunks = [];
                    let text = cell.v;
                    while (text.length > maxLength) {
                        chunks.push(text.slice(0, maxLength));
                        text = text.slice(maxLength);
                    }
                    chunks.push(text);
                    cell.v = chunks.shift();
                    chunks.forEach((chunk) => {
                        const newCellAddress = XLSX.utils.encode_cell({
                            r: R + chunks.length,
                            c: C,
                        });
                        worksheet[newCellAddress] = { t: "s", v: chunk };
                    });
                }
            }
        }
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });
        const excelData = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        if (typeof saveAs === "function") {
            saveAs(excelData, "table.xlsx");
        } else {
            const downloadLink = document.createElement("a");
            downloadLink.href = URL.createObjectURL(excelData);
            downloadLink.download = "table.xlsx";
            downloadLink.click();
        }
    };
    ////Export to excel end/////

    const expndpopup = (e: any) => {
        settablecontiner(e);
    };
    const openCreationAllStructure = (eventValue: any) => {
        if (eventValue === "Add Structure") {
            items?.OpenAddStructureModal();
        } else if (eventValue === "Add Activity-Task") {
            items?.addActivity();
        } else if (eventValue === "Add Workstream-Task") {
            items?.AddWorkstreamTask();
        }
    }



    ///////////////// code with neha /////////////////////
    const callChildFunction = (items: any) => {
        if (childRef.current) {
            childRef.current.OpenModal(items);
        }
    };

    const trueTopIcon = (items: any) => {
        if (childRef.current) {
            childRef.current.trueTopIcon(items);
        }
    };

    React.useImperativeHandle(ref, () => ({
        callChildFunction, trueTopIcon, setRowSelection
    }));

    const restructureFunct = (items: any) => {
        setTrueRestructuring(items);
    }

    ////////////////  end /////////////////
    //Virual rows
    const parentRef: any = React.useRef<HTMLDivElement>(null);
    const { rows } = table.getRowModel();
    // const virtualizer = useVirtualizer({
    //     count: rows.length,
    //     getScrollElement: () => parentRef.current,
    //     // estimateSize: () => 24,
    //     // overscan: 15,
    //     estimateSize: () => 200,
    //     overscan: 50,
    // });

    // const itemsVirtualizer: any = virtualizer.getVirtualItems();
    // const [before, after] =
    //     itemsVirtualizer.length > 0
    //         ? [
    //             notUndefined(itemsVirtualizer[0]).start - virtualizer.options.scrollMargin,
    //             virtualizer.getTotalSize() -
    //             notUndefined(itemsVirtualizer[itemsVirtualizer.length - 1]).end,
    //         ]
    //         : [0, 0];

    // const setTableHeight = () => {
    //     const screenHeight = window.innerHeight;
    //    const tableHeight = screenHeight * 0.8 - 5;
    //     parentRef.current.style.height = `${screenHeight}px`;
    // };
    // React.useEffect(() => {
    //     if (wrapperHeight) {
    //         parentRef.current.style.height = wrapperHeight;
    //     } else {
    //         setTableHeight();
    //         window.addEventListener('resize', setTableHeight);
    //         return () => {
    //             window.removeEventListener('resize', setTableHeight);
    //         };
    //     }
    // }, [, wrapperHeight]);
    //Virtual rows

    return (
        <>
            {showHeader === true && <div className='tbl-headings justify-content-between mb-0 fixed-Header top-0' style={{ background: '#005437' }}>
            <span className='leftsec'>
            <h4 className='table-heading'>Briefwahl-Informationen und Abgabefristen aller deutsche Auslandsvertretungen</h4>
            </span>
                {/* <span className='leftsec'>
                    {showingAllPortFolioCount === true ? <div className='mb-1'>
                        <label style={{ color: `${portfolioColor}` }}>
                            Showing
                        </label>
                        {portfolioTypeData.map((type: any, index: any) => {
                            return (
                                <>
                                    {isShowingDataAll === true ? <><label className='ms-1' style={{ color: `${portfolioColor}` }}>{` ${type[type.Title + 'numberCopy']} `} of {" "} </label> <label style={{ color: `${portfolioColor}` }} className='ms-0'>{` ${type[type.Title + 'number']} `}</label><label style={{ color: `${portfolioColor}` }} className='ms-1'>{" "} {type.Title}</label>{index < type.length - 1 && <label style={{ color: `${portfolioColor}` }} className="ms-1"> | </label>}</> :
                                        <><label className='ms-1' style={{ color: `${portfolioColor}` }}>{` ${type[type.Title + 'number']} `} of {" "} </label> <label style={{ color: `${portfolioColor}` }} className='ms-0'>{` ${type[type.Title + 'number']} `}</label><label style={{ color: `${portfolioColor}` }} className='ms-1'>{" "} {type.Title}</label>{index < type.length - 1 && <label style={{ color: `${portfolioColor}` }} className="ms-1"> | </label>}</>}
                                </>
                            )
                        })}



                        <span className="popover__wrapper ms-1" style={{ position: "unset" }} data-bs-toggle="tooltip" data-bs-placement="auto">
                            <span className='svg__iconbox svg__icon--info alignIcon dark'></span>
                            <span className="popover__content mt-3 m-3 mx-3" style={{ zIndex: 100 }}>
                                <label style={{ color: `${portfolioColor}` }}>
                                    Showing
                                </label>
                                {portfolioTypeData.map((type: any, index: any) => {
                                    return (
                                        <>
                                            {isShowingDataAll === true ? <><label className='ms-1' style={{ color: `${portfolioColor}` }}>{` ${type[type.Title + 'numberCopy']} `} of {" "} </label> <label style={{ color: `${portfolioColor}` }} className='ms-0'>{` ${type[type.Title + 'number']} `}</label><label style={{ color: `${portfolioColor}` }} className='ms-1'>{" "} {type.Title}</label><label style={{ color: `${portfolioColor}` }} className="ms-1"> | </label></> :
                                                <><label className='ms-1' style={{ color: `${portfolioColor}` }}>{` ${type[type.Title + 'number']} `} of {" "} </label> <label style={{ color: `${portfolioColor}` }} className='ms-0'>{` ${type[type.Title + 'number']} `}</label><label style={{ color: `${portfolioColor}` }} className='ms-1'>{" "} {type.Title}</label><label style={{ color: `${portfolioColor}` }} className="ms-1"> | </label></>}
                                        </>
                                    )
                                })}
                                {items?.taskTypeDataItem?.map((type: any, index: any) => {
                                    return (
                                        <>
                                            {isShowingDataAll === true ? <><label className='ms-1' style={{ color: `${portfolioColor}` }}>{` ${type[type.Title + 'numberCopy']} `} of {" "} </label> <label style={{ color: `${portfolioColor}` }} className='ms-0'>{` ${type[type.Title + 'number']} `}</label><label style={{ color: `${portfolioColor}` }} className='ms-1'>{" "} {type.Title}</label>{index < items?.taskTypeDataItem?.length - 1 && <label style={{ color: `${portfolioColor}` }} className="ms-1"> | </label>}</> :
                                                <><label className='ms-1' style={{ color: `${portfolioColor}` }}>{` ${type[type.Title + 'number']} `} of {" "} </label> <label style={{ color: `${portfolioColor}` }} className='ms-0'>{` ${type[type.Title + 'number']} `}</label><label style={{ color: `${portfolioColor}` }} className='ms-1'>{" "} {type.Title}</label>{index < items?.taskTypeDataItem?.length - 1 && <label style={{ color: `${portfolioColor}` }} className="ms-1"> | </label>}</>}
                                        </>
                                    )
                                })}
                            </span>
                        </span>
                    </div> :
                    
                     <span style={{ color: `${portfolioColor}` }} className='Header-Showing-Items'>{`Showing ${table?.getFilteredRowModel()?.rows?.length} of ${data?.length}`}</span>}
                    <DebouncedInput
                        value={globalFilter ?? ""}
                        onChange={(value) => setGlobalFilter(String(value))}
                        placeholder="Search All..."
                        portfolioColor={portfolioColor}
                    />
                     <span className="svg__iconbox svg__icon--setting" style={{ backgroundColor: `${portfolioColor}` }} onClick={() => setSelectedFilterPanelIsOpen(true)}></span>
                    <span className='ms-1'>
                        <select style={{ height: "40px", color: `${portfolioColor}` }}
                            className="custom-select"
                            aria-label="Default select example"
                            value={globalSearchType}
                            onChange={(e) => {
                                setGlobalSearchType(e.target.value);
                                setGlobalFilter("");
                            }}
                        >
                            <option value="ALL">All Words</option>
                            <option value="ANY">Any Words</option>
                            <option value="EXACT">Exact Phrase</option>
                        </select>
                    </span> 
                </span> */}
                {/* <span className="toolbox">
                    {items.taskProfile != true && items?.showCreationAllButton === true && <>
                        {table?.getSelectedRowModel()?.flatRows?.length === 1 && table?.getSelectedRowModel()?.flatRows[0]?.original?.Item_x0020_Type != "Feature" &&
                            table?.getSelectedRowModel()?.flatRows[0]?.original?.TaskType?.Title != "Activities" && table?.getSelectedRowModel()?.flatRows[0]?.original?.TaskType?.Title != "Workstream" &&
                            table?.getSelectedRowModel()?.flatRows[0]?.original?.TaskType?.Title != "Task" || table?.getSelectedRowModel()?.flatRows?.length === 0 ? (
                            <button type="button" className="btn btn-primary" style={{ backgroundColor: `${portfolioColor}`, borderColor: `${portfolioColor}`, color: '#fff' }} title=" Add Structure" onClick={() => openCreationAllStructure("Add Structure")}> Add Structure </button>
                        ) : (
                            <button type="button" disabled className="btn btn-primary" style={{ backgroundColor: `${portfolioColor}`, borderColor: `${portfolioColor}`, color: '#fff' }} title=" Add Structure"> Add Structure </button>
                        )}
                        {table?.getSelectedRowModel()?.flatRows.length === 1 ? <button type="button" className="btn btn-primary" title='Add Activity' style={{ backgroundColor: `${portfolioColor}`, borderColor: `${portfolioColor}`, color: '#fff' }} onClick={() => openCreationAllStructure("Add Activity-Task")}>Add Activity-Task</button> :
                            <button type="button" className="btn btn-primary" style={{ backgroundColor: `${portfolioColor}`, borderColor: `${portfolioColor}`, color: '#fff' }} disabled={true} > Add Activity-Task</button>}


                    </>
                    }

                    {items.taskProfile === true && items?.showCreationAllButton === true && <>
                        {table?.getSelectedRowModel()?.flatRows.length < 2 ? <button type="button" className="btn btn-primary" title='Add Activity' style={{ backgroundColor: `${portfolioColor}`, borderColor: `${portfolioColor}`, color: '#fff' }} onClick={() => openCreationAllStructure("Add Workstream-Task")}>Add Workstream-Task</button> :
                            <button type="button" className="btn btn-primary" style={{ backgroundColor: `${portfolioColor}`, borderColor: `${portfolioColor}`, color: '#fff' }} disabled={true} > Add Workstream-Task</button>}
                    </>
                    }
                    {
                        items?.customHeaderButtonAvailable === true && items?.customTableHeaderButtons
                    }
                    {items?.hideTeamIcon != true ? <>
                        {table?.getSelectedRowModel()?.flatRows?.length > 0 ? <a className="teamIcon" onClick={() => ShowTeamFunc()}><span title="Create Teams Group" style={{ color: `${portfolioColor}`, backgroundColor: `${portfolioColor}` }} className="svg__iconbox svg__icon--team"></span></a>
                            : <a className="teamIcon"><span title="Create Teams Group" style={{ backgroundColor: "gray" }} className="svg__iconbox svg__icon--team"></span></a>}
                    </> : ''}
                    {items?.hideOpenNewTableIcon != true ? <>
                        {table?.getSelectedRowModel()?.flatRows?.length > 0 ?
                            <a onClick={() => openTaskAndPortfolioMulti()} title='Open in New Tab' className="openWebIcon p-0"><span style={{ color: `${portfolioColor}`, backgroundColor: `${portfolioColor}` }} className="svg__iconbox svg__icon--openWeb"></span></a>
                            : <a className="openWebIcon p-0" title='Open in New Tab'><span className="svg__iconbox svg__icon--openWeb" style={{ backgroundColor: "gray" }}></span></a>}
                    </> : ''}
                    {items?.hideExcelIcon != true ? <>
                        {table?.getSelectedRowModel()?.flatRows?.length > 0 ? <a className='excal' title='Export to excel' onClick={() => exportToExcel()}><RiFileExcel2Fill style={{ color: `${portfolioColor}` }} /></a>
                            : ''}
                    </> : ''}
                    <a className='brush'><i className="fa fa-paint-brush hreflink" style={{ color: `${portfolioColor}` }} aria-hidden="true" title="Clear All" onClick={() => { setGlobalFilter(''); setColumnFilters([]); }}></i></a>

                    {items?.hidePrintsIcon != true ? <>
                        {table?.getSelectedRowModel()?.flatRows?.length > 0 ? <a className='Prints' onClick={() => downloadPdf()}>
                            <i className="fa fa-print" aria-hidden="true" style={{ color: `${portfolioColor}` }} title="Print"></i>
                        </a>
                            : ''}
                    </> : ''}


                </span> */}
            </div>}

            <div ref={parentRef} >
                    <table className="SortingTable table table-hover mb-0" id='my-table' style={{ width: "100%" }}>
                        <thead className='fixed-Header top-0'>
                            {table.getHeaderGroups().map((headerGroup: any) => (
                                <tr key={headerGroup.id} >
                                    {headerGroup.headers.map((header: any) => {
                                        return (
                                            <th key={header.id} colSpan={header.colSpan} style={header.column.columnDef.size != undefined && header.column.columnDef.size != 150 ? { width: header.column.columnDef.size + "px" } : {}}>
                                                {header.isPlaceholder ? null : (
                                                    <div className='position-relative' style={{ display: "flex" }}>
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                        {header.column.getCanFilter() ? (
                                                            // <span>
                                                            <Filter column={header.column} table={table} placeholder={header.column.columnDef} />
                                                            // </span>
                                                        ) : null}
                                                        {header.column.getCanSort() ? <div
                                                            {...{
                                                                className: header.column.getCanSort()
                                                                    ? "cursor-pointer select-none shorticon "
                                                                    : "",
                                                                onClick: header.column.getToggleSortingHandler(),
                                                            }}
                                                        >
                                                            {header.column.getIsSorted()
                                                                ? { asc: <div className='upArrow'><SlArrowDown style={{ color: `${portfolioColor}` }} /></div>, desc: <div className='downArrow'><SlArrowUp style={{ color: `${portfolioColor}` }} /></div> }[
                                                                header.column.getIsSorted() as string
                                                                ] ?? null
                                                                : <><div className='downArrow'><SlArrowUp style={{ color: "#818181" }} /></div><div className='upArrow'><SlArrowDown style={{ color: "#818181" }} /></div></>}
                                                        </div> : ""}
                                                    </div>
                                                )}
                                            </th>
                                        );
                                    })}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map((row: any, index: any) => {
                                return (
                                    <tr
                                        className={row?.original?.lableColor}
                                        // className={row?.original?.IsSCProtected != undefined && row?.original?.IsSCProtected == true ? `Disabled-Link opacity-75 ${row?.original?.lableColor}` : `${row?.original?.lableColor}`}
                                        key={row.id}>
                                        {row.getVisibleCells().map((cell: any) => {
                                            return (
                                                <td className={row?.original?.boldRow} key={cell.id} style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: `${row?.original?.PortfolioType?.Color}` }}>
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {data?.length === 0 && <div className='mt-2'>
                        <div className='d-flex justify-content-center' style={{ height: "30px", color: portfolioColor ? `${portfolioColor}` : "#008939" }}>No data available</div>
                    </div>}
               
            </div>
        </>
    )
}
export default React.forwardRef(GlobalCommanTable);
