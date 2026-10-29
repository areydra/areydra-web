import AboutSection from "@/app/_components/home/AboutSection";
import BlogPreviewSection from "@/app/_components/home/BlogPreviewSection";
import ContactSection from "@/app/_components/home/ContactSection";
import HeroSection from "@/app/_components/home/HeroSection";
import HomeShell from "@/app/_components/home/HomeShell";
import MarqueeSection from "@/app/_components/home/MarqueeSection";
import ProjectsSection from "@/app/_components/home/ProjectsSection";
import SkillsSection from "@/app/_components/home/SkillsSection";
import StatsSection from "@/app/_components/home/StatsSection";
import WorkHistorySection from "@/app/_components/home/WorkHistorySection";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/constants/site";
import { getHomeData } from "@/services/portfolio-service.server";

import type { Metadata } from "next";

export const metadata: Metadata = {
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export default async function Home() {
  const { profile, skills, workHistory, homeConfig } = await getHomeData();
  const profileData = profile.data;
  const skillGroups = skills.data?.items ?? null;
  const jobs = workHistory.data?.items ?? null;
  const projects = homeConfig.data?.projects ?? null;
  const posts = homeConfig.data?.posts ?? null;

  return (
    <HomeShell
      hasProjects={!!projects?.length}
      hasBlog={!!posts?.length}
    >
      <main id="main-content">
        <HeroSection profile={profileData} />
        <MarqueeSection skillGroups={skillGroups} />
        <StatsSection
          profile={profileData}
          skillGroups={skillGroups}
          workHistory={jobs}
        />
        <AboutSection
          profile={profileData}
          error={profile.error}
        />
        <SkillsSection
          skillGroups={skillGroups}
          error={skills.error}
        />
        <WorkHistorySection
          jobs={jobs}
          error={workHistory.error}
        />
        {!!projects?.length && (
          <ProjectsSection
            projects={projects}
            error={homeConfig.error}
          />
        )}
        {!!posts?.length && (
          <BlogPreviewSection
            posts={posts}
            error={homeConfig.error}
          />
        )}
        <ContactSection profile={profileData} />
      </main>
    </HomeShell>
  );
}
