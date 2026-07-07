"use client";

import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

const ApexChartExample = ({
    title,
    name,
    data,
}: {
    title: string;
    name: string;
    data: { label: string; count: number }[];
}) => {
    const series = [
        {
            name: name,
            data: data.map((d) => d.count),
        },
    ];

    const options: ApexOptions = {
        chart: {
            type: "line",
            toolbar: {
                show: true,
            },
            zoom: {
                enabled: false,
            },
        },

        stroke: {
            curve: "smooth",
            width: 3,
        },

        title: {
            text: title,
            align: "left",
            style: {
                fontSize: "18px",
            },
        },

        xaxis: {
            categories: data.map((d) => d.label),
            labels: {
                rotate: -45,
                hideOverlappingLabels: true,
            },
        },

        yaxis: {
            title: {
                text: name,
            },
        },

        dataLabels: {
            enabled: false,
        },

        responsive: [
            {
                breakpoint: 1024,
                options: {
                    chart: {
                        height: 320,
                    },
                },
            },
            {
                breakpoint: 768,
                options: {
                    chart: {
                        height: 280,
                    },
                    title: {
                        style: {
                            fontSize: "16px",
                        },
                    },
                    xaxis: {
                        labels: {
                            rotate: -90,
                            style: {
                                fontSize: "10px",
                            },
                        },
                    },
                },
            },
            {
                breakpoint: 480,
                options: {
                    chart: {
                        height: 250,
                    },
                    title: {
                        style: {
                            fontSize: "14px",
                        },
                    },
                    xaxis: {
                        labels: {
                            rotate: -90,
                            style: {
                                fontSize: "9px",
                            },
                        },
                    },
                },
            },
        ],
    };

    return (
        <div className="w-full overflow-x-auto rounded-lg border bg-background p-4">
            <Chart
                options={options}
                series={series}
                type="line"
                width="100%"
                height={350}
            />
        </div>
    );
};

export default ApexChartExample;