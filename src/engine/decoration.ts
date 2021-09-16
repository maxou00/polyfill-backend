export interface FillablePalette {
    primary: string;
    secondary: string;
    fillable: {
        title: string;
        subtitle: string;
    };
    defaultText: string;
    page: {
        title: string;
        subtitle: string;
        background: string;
    };
    question: {
        title: string;
        description: string;
        error: string;
        helper: string;
    }
}

export interface FillableBranding {
    brand?: {
        logo:string;
        name: string;
        subtitle: string;
    }
    background: {
        color?: string;
        image?: string;
    }
}

export interface FillableDecoration {
    branding?: FillableBranding,
    palette: FillablePalette;
}