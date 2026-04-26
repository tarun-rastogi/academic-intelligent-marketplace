import { Shell } from "@/components/Shell";
import { ExamSearch } from "./ExamSearch";

export const dynamic = "force-dynamic";

export default function SearchPage() {
  return (
    <Shell>
      <ExamSearch />
    </Shell>
  );
}
