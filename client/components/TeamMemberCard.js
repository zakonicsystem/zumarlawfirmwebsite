import FaIcon from "@/components/FaIcon";
import RichContent from "@/components/RichContent";
import { plainText } from "@/lib/text";

export default function TeamMemberCard({ member, headingLevel = "h2" }) {
  const Heading = headingLevel;
  const hasImage = Boolean(member.image);

  return (
    <article className="group overflow-hidden rounded-[2rem] bg-white p-6 shadow-xl shadow-primary/5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10">
      <div className="relative flex h-[20rem] items-end justify-center overflow-hidden rounded-[1.75rem] bg-white">
        <div className="absolute bottom-10 left-1/2 h-[17rem] w-[15.5rem] -translate-x-1/2 skew-x-[-17deg] rounded-[2rem] bg-[#57123f] transition duration-300 group-hover:skew-x-[-14deg]" />
        <div className="absolute bottom-10 left-1/2 h-[17rem] w-[15.5rem] -translate-x-1/2 skew-x-[-17deg] rounded-[2rem] bg-white/10 mix-blend-screen" />
        {hasImage ? (
          <div className="relative z-10 mb-24 grid h-36 w-36 place-items-center overflow-hidden rounded-full border border-primary/10 bg-white shadow-2xl shadow-primary/15">
            <img className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-[1.04]" src={member.image} alt={`${plainText(member.name, "Team member")} profile photo`} />
          </div>
        ) : (
          <div className="relative z-10 mb-24 grid h-36 w-36 place-items-center rounded-full border border-primary/10 bg-white shadow-2xl shadow-primary/15">
            <FaIcon className="size-16 text-primary/65" name="user" />
          </div>
        )}
      </div>
      <div className="px-4 pb-4 pt-2">
        <Heading className="text-3xl font-black leading-tight text-primary">{member.name && <RichContent content={member.name} />}</Heading>
        <div className="mt-5 text-xl font-semibold leading-7 text-primary/55">{(member.designation || member.role) && <RichContent content={member.designation || member.role} />}</div>
        {member.branch ? <p className="mt-2 text-sm font-bold uppercase tracking-wide text-primary/40">{member.branch}</p> : null}
      </div>
    </article>
  );
}
