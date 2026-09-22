import { AboutSection } from "@/components/home/AboutSection";
import { BlogPreviewSection } from "@/components/home/BlogPreviewSection";
import { ContactSection } from "@/components/home/ContactSection";
import { HeroSection } from "@/components/home/HeroSection";
import { HomeShell } from "@/components/home/HomeShell";
import { MarqueeSection } from "@/components/home/MarqueeSection";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import { SkillsSection } from "@/components/home/SkillsSection";
import { StatsSection } from "@/components/home/StatsSection";
import { WorkHistorySection } from "@/components/home/WorkHistorySection";
import { getHomeData } from "@/lib/portfolio-api";

export default async function Home() {
  const { profile, skills, workHistory, homeConfig } = await getHomeData();
  const profileData = profile.data;
  const skillGroups = skills.data?.items ?? null;
  const jobs = workHistory.data?.items ?? null;
  const projects = homeConfig.data?.projects ?? null;
  const posts = homeConfig.data?.posts ?? null;

  return (
    <HomeShell hasProjects={!!projects?.length} hasBlog={!!posts?.length}>
      <HeroSection profile={profileData} />
      <MarqueeSection skillGroups={skillGroups} />
      <StatsSection profile={profileData} skillGroups={skillGroups} workHistory={jobs} />
      <AboutSection profile={profileData} error={profile.error} />
      <SkillsSection skillGroups={skillGroups} error={skills.error} />
      <WorkHistorySection jobs={jobs} error={workHistory.error} />
      {!!projects?.length && <ProjectsSection projects={projects} error={homeConfig.error} />}
      {!!posts?.length && <BlogPreviewSection posts={posts} error={homeConfig.error} />}
      <ContactSection profile={profileData} />
    </HomeShell>
  );
}
