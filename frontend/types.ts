export type Site = {
    id: string;
    name: string;
    siteID: string;
};

export type LogInInput = {
    email: string;
};

export type SignUpInput = LogInInput & {
    name: string;
    cpso?: string;
    sites?: Site[] | [];
};

export type RedeemInput = LogInInput & {
    token: string;
};

export type updateProfileInput = SignUpInput;

export type consentToPolicyInput = {
    policyAccepted: boolean;
};

type Role = {
    id: string;
};

type Description = {
    name: string;
    email: string;
    cpso?: string;
    sites: Site[] | [];
};

export type Request = {
    type: string;
    user: User;
    status: string;
    description: Description;
    updatedAt: string;
};

export type User = {
    id: string;
    name: string;
    email: string;
    password: string;
    cpso: string;
    policyAccepted: boolean;
    role: Role;
    sites: Site[] | [];
    requests: Request[] | [];
};

type Tag = {
    name: string;
};

export type Report = {
    id: string;
    title: string;
    updatedAt: number;
    tags: Tag[];
    site: Site;
    isCurrent?: boolean;
    isUnavailable?: boolean;
};

export type Option = unknown;

export type Banner = {
    date: number;
    individualReportVersion: string;
    groupReportVersion: string;
};

export enum ReportTypes {
    IRP = "irp",
    GRP = "grp",
}

export type ReportVersions = {
    statusCode: number;
    error?: string;
    irp: string[];
    grp: string[];
};
