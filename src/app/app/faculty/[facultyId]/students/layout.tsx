"use client";

import { DataFetchErrorResult } from "@/components/errorResult";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import { useYid } from "@/hooks/use-yid";
import {
    getAllYearEnrollmentsByFaculty,
  getClasses,
  getDepartmentsByFacultyId,
  getPeriodEnrollmentsbyFaculty,
  getPeriodsByYear,

} from "@/lib/api";
import { Period } from "@/types";
import { ClockCircleOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Tabs, Typography } from "antd";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import { NewPeriodEnrollmentForm } from "./[periodId]/forms/new";

export default function Layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const router = useRouter();
  const pathname = usePathname();
  const { facultyId, periodId } = useParams();
  const { yid } = useYid();

  const { data: yearEnrollments } = useQuery({
    queryKey: ["all_year_enrollments", `${yid}`, facultyId],
    queryFn: ({ queryKey }) =>
      getAllYearEnrollmentsByFaculty(Number(queryKey[1]), Number(queryKey[2])),
    enabled: !!yid && !!facultyId,
  });

  const {
    data: periods,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["periods", `${yid}`],
    queryFn: ({ queryKey }) => getPeriodsByYear(Number(queryKey[1])),
    enabled: !!yid,
  });

  const { data: periodEnrollments } = useQuery({
    queryKey: ["period_enrollments", `${yid}`, facultyId, periodId],
    queryFn: ({ queryKey }) =>
      getPeriodEnrollmentsbyFaculty(
        Number(queryKey[1]),
        Number(queryKey[2]),
        Number(queryKey[3])
      ),
    enabled: !!yid && !!facultyId && !!periodId,
  });

  const getPeriodsAsTabs = (periods?: Period[]) => {
    return periods?.map((period) => ({
      key: `/app/faculty/${facultyId}/students/${period.id}`,
      label: `${period.name} (${period.acronym})`,
    }));
  };

      const { data: departments } = useQuery({
        queryKey: ["departments", facultyId],
        queryFn: ({ queryKey }) =>
          getDepartmentsByFacultyId(Number(queryKey[1])),
        enabled: !!facultyId,
      });

         const {
      data: classes,
    } = useQuery({
      queryKey: ["classes"],
      queryFn: getClasses,
    });

  const getPeriodsAsDropdownMenu = (periods?: Period[]) => {
    return periods?.map((period) => ({
      key: `${period.id}`,
      label: `${period.name} (${period.acronym})`,
      icon: <ClockCircleOutlined />,
    }));
  };

  if (isPending) {
    return <DataFetchPendingSkeleton variant="table" />;
  }

  if (isError) {
    return <DataFetchErrorResult />;
  }

  return (
    <>
      <Typography.Title level={3}>Inscriptions</Typography.Title>
      <Tabs
        items={[
          {
            key: `/app/faculty/${facultyId}/students`,
            label: "Année",
          },
          ...getPeriodsAsTabs(periods)!,
        ]}
        defaultActiveKey={pathname}
        activeKey={pathname}
        onChange={(key) => router.push(key)}
        tabBarExtraContent={
          <NewPeriodEnrollmentForm
            periodsAsMenu={[...getPeriodsAsDropdownMenu(periods)!]}
            periods={periods}
            yearEnrollments={yearEnrollments}
            periodEnrollments={periodEnrollments}
            departments={departments}
            classes={classes} // Promotions
          />
        }
      />
      <>{children}</>
    </>
  );
}
