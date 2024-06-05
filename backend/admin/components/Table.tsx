/** @jsxRuntime classic */
/** @jsx jsx */
import React, { Fragment } from "react";
import Link from "next/link";
import { jsx, css } from "@keystone-ui/core";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Tooltip from "./Tooltip";

export const tableStyles = css`
  border-collapse: collapse;
  margin: 25px 0;
  font-size: 0.9em;
  font-family: sans-serif;
  min-width: 90%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  thead tr {
    background-color: #2563eb;
    color: #ffffff;
    text-align: left;
    text-transform: uppercase;
  }
  th,
  td {
    padding: 12px 15px;
  }
  tbody tr {
    border-bottom: 1px solid #dddddd;
  }

  tbody tr:nth-of-type(even) {
    background-color: #f3f3f3;
  }
  tbody tr:last-of-type {
    border-bottom: 2px solid #2563eb;
  }
`;

const checkboxStyle = css`
  display: flex;
  gap: 1em;
  cursor: pointer;
  width: fit-content;
`;

const iconStyle = css`
  width: 1em;
  height: 1em;
  display: inline-block;
  line-height: 1em;
  flex-shrink: 0;
  color: currentColor;
  vertical-align: middle;
`;

const errorColor = "#dc2626";
const warningColor = "#DD6B20";
const successColor = "#38A169";
const infoColor = "#3182ce";

const buttonStyle = css({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  outline: "0",
  position: "relative",
  borderColor: "transparent",
  borderRadius: "4px",
  borderWidth: "1px",
  height: "32px",
  width: "8em",
  padding: "0 12px 0 12px",
  backgroundColor: successColor,
  color: "#fff",
  fontSize: "0.875rem",
  fontWeight: "500",
});

type Validator = {
  userExists: boolean;
  cpsoExists: boolean;
  cpsoMatches: boolean;
  siteExists: boolean;
  roleExists: boolean;
  roleMatches: boolean;
  userAssigned: string;
};

export type Mapping = {
  cpso: string;
  name: string;
  email: string;
  role: string;
  title: string;
  site: string;
  tags: string;
  validation: Validator;
  uploadStatus: boolean | undefined;
};

const columnHelper = createColumnHelper<Mapping>();

const columns = [
  columnHelper.display({
    id: "number",
    header: "#",
    cell: (info) => info.row.index + 1,
  }),
  columnHelper.accessor("cpso", {
    header: "CPSO",
    cell: (info) => {
      const validation = info.row.original.validation;
      if (validation && validation.userExists && !validation.cpsoMatches) {
        return renderErrorComponent(
          info.getValue(),
          "CPSO provided does not match",
          "right",
        );
      }
      if (validation && validation.cpsoExists) {
        return renderErrorComponent(
          info.getValue(),
          "CPSO provided belongs to a different User",
          "right",
        );
      }
      return info.getValue();
    },
  }),
  columnHelper.accessor((row) => row.name, {
    header: "Name",
  }),
  columnHelper.accessor("email", {
    header: () => "Email",
    cell: (info) => {
      const validation = info.row.original.validation;
      if (validation && !validation.userExists) {
        return renderErrorComponent(
          info.getValue(),
          "User does not exist",
          "right",
          warningColor,
        );
      }
      return info.getValue();
    },
  }),
  columnHelper.accessor((row) => row.role, {
    header: "Role",
    cell: (info) => {
      const validation = info.row.original.validation;
      if (validation && !validation.roleExists) {
        return renderErrorComponent(
          info.getValue(),
          "Role does not exist",
          "right",
        );
      }
      if (validation && !validation.roleMatches && validation.userExists) {
        return renderErrorComponent(
          info.getValue(),
          "User is assigned a different role",
          "right",
          warningColor,
        );
      }
      return info.getValue();
    },
  }),
  columnHelper.accessor("title", {
    header: "Title",
    cell: (info) => {
      const validation = info.row.original.validation;
      if (validation && validation.userAssigned) {
        return (
          <Link
            href={`/reports/${info.row.original.validation.userAssigned}`}
            target="_blank"
          >
            {info.getValue()}
          </Link>
        );
      }
      return info.renderValue();
    },
  }),
  columnHelper.accessor("site", {
    header: "Site",
    cell: (info) => {
      const validation = info.row.original.validation;
      if (validation && !validation.siteExists) {
        return renderErrorComponent(
          info.getValue(),
          "Invalid Site: check the site id matches the site data",
          "left",
        );
      }
      return info.getValue();
    },
  }),
  columnHelper.accessor("tags", {
    header: "Tags",
    cell: (info) => {
      return info.getValue();
    },
  }),
  columnHelper.display({
    id: "status",
    header: "Upload Status",
    cell: ({ row }) => {
      const status = row.original.uploadStatus;
      if (status === undefined) {
        return (
          <span
            css={css`
              ${buttonStyle};
              background-color: #2563eb;
            `}
          >
            Pending
          </span>
        );
      }
      if (status) {
        return (
          <span
            css={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              outline: "0",
              position: "relative",
              borderColor: "transparent",
              borderRadius: "4px",
              borderWidth: "1px",
              height: "32px",
              width: "8em",
              padding: "0 12px 0 12px",
              backgroundColor: "#38A169",
              color: "#fff",
              fontSize: "0.875rem",
              fontWeight: "500",
            }}
          >
            Success
          </span>
        );
      }
      return (
        <span
          css={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            outline: "0",
            position: "relative",
            borderColor: "transparent",
            borderRadius: "4px",
            borderWidth: "1px",
            height: "32px",
            width: "8em",
            padding: "0 12px 0 12px",
            backgroundColor: "#dc2626",
            color: "#fff",
            fontSize: "0.875rem",
            fontWeight: "500",
          }}
        >
          Fail
        </span>
      );
    },
  }),
];

function renderErrorComponent(
  value,
  tooltipContent: string,
  tooltipDir: string,
  color: string = errorColor,
) {
  return (
    <span css={{ color: color, display: "inline-flex", gap: "0.5em" }}>
      <b>{value}</b>
      <Tooltip content={tooltipContent} direction={tooltipDir}>
        <svg viewBox="0 0 24 24" focusable="false" css={iconStyle}>
          <path
            fill="currentColor"
            d="M11.983,0a12.206,12.206,0,0,0-8.51,3.653A11.8,11.8,0,0,0,0,12.207,11.779,11.779,0,0,0,11.8,24h.214A12.111,12.111,0,0,0,24,11.791h0A11.766,11.766,0,0,0,11.983,0ZM10.5,16.542a1.476,1.476,0,0,1,1.449-1.53h.027a1.527,1.527,0,0,1,1.523,1.47,1.475,1.475,0,0,1-1.449,1.53h-.027A1.529,1.529,0,0,1,10.5,16.542ZM11,12.5v-6a1,1,0,0,1,2,0v6a1,1,0,1,1-2,0Z"
          ></path>
        </svg>
      </Tooltip>
    </span>
  );
}

function rowHasError({ cpsoMatches, siteExists, userExists }) {
  return !cpsoMatches || !siteExists || !userExists;
}

type TableProps<TData> = {
  data: TData[];
};

export default function Table({ data }: TableProps<Mapping>) {
  const [globalFilter, setGlobalFilter] = React.useState(false);
  const table = useReactTable<Mapping>({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row) =>
      row.original.validation ? rowHasError(row.original.validation) : true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <Fragment>
      <label css={checkboxStyle}>
        <input
          type="checkbox"
          onChange={() => setGlobalFilter(!globalFilter)}
        />
        Show errors only
      </label>
      <span>{table.getRowModel().rows.length} Rows</span>
      <table css={tableStyles}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  css={{ border: "1px solid #dddddd", padding: "8px" }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <Fragment key={row.id}>
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              </Fragment>
            );
          })}
        </tbody>
      </table>
      <div>{table.getRowModel().rows.length} Rows</div>
    </Fragment>
  );
}
