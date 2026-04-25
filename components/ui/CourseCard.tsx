import Link from "next/link";
import type { Course } from "@/types/index";

interface CourseCardProps {
  course: Course;
}

/**
 * Server component — renders a single AP course card.
 * Uses next/link for internal navigation. All data comes from Prismic.
 */
export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={course.urlPath} className="ccard">
      <div className="ctop2">
        <div className="icon" aria-hidden="true">
          {course.icon}
        </div>
        <span className="qcount">{course.questionCount}</span>
      </div>
      <h3>{course.title}</h3>
      <p>{course.description}</p>
      <span className="clink">Explore course →</span>
    </Link>
  );
}
