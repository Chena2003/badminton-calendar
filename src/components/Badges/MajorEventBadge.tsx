import React from "react";
import {useTranslations} from 'next-intl';

interface Props {
	mobileOnly?: boolean;
}

const MajorEventBadge: React.FC<Props> = ({ mobileOnly }: Props) => {
	const t = useTranslations('All');

	return (
		<span className={`bg-red-600 rounded px-1 md:px-2 py-1 text-xsm text-white font-bold ml-2 ${mobileOnly ? "display sm:hidden" : ""}`}>
			{t(`badges.major`)}
		</span>
	);
}

export default MajorEventBadge;
