export interface Call {
    id: string
    timestamp: string
    managerName: string
    calledAbout: string
    status: "Completed" | "Failed" | "Partial"
    duration: number // in minutes
    cost: number
    workflowId: string
}

export interface Transcription {
    id: string
    callId: string
    timestamp: string
    fullText: string
}

export interface Summary {
    id: string
    callId: string
    summaryText: string
}

export interface Workflow {
    id: string
    date: string
    status: "Success" | "Partial" | "Failed"
    summary: string
    totalCost: number
    manager: string
    callIds: string[]
}

export interface Usage {
    billingMonth: string
    totalUsage: number // in minutes
    totalCost: number
    workflowBreakdown: {
        workflowId: string
        date: string
        manager: string
        callCount: number
        duration: number
        cost: number
    }[]
}

// Enhanced dummy data with more comprehensive content
export const calls: Call[] = [
    {
        id: "call-001",
        timestamp: "2024-01-15T08:15:00Z",
        managerName: "Sarah Johnson",
        calledAbout: "Daily Operations Update & Staff Performance Review",
        status: "Completed",
        duration: 12,
        cost: 4.8,
        workflowId: "workflow-001",
    },
    {
        id: "call-002",
        timestamp: "2024-01-15T08:30:00Z",
        managerName: "Mike Chen",
        calledAbout: "Equipment Status Report & Maintenance Schedule",
        status: "Completed",
        duration: 8,
        cost: 3.2,
        workflowId: "workflow-001",
    },
    {
        id: "call-003",
        timestamp: "2024-01-16T08:12:00Z",
        managerName: "Sarah Johnson",
        calledAbout: "Staff Scheduling Issues & Resource Allocation",
        status: "Completed",
        duration: 15,
        cost: 6.0,
        workflowId: "workflow-002",
    },
    {
        id: "call-004",
        timestamp: "2024-01-16T08:28:00Z",
        managerName: "Mike Chen",
        calledAbout: "Critical Maintenance Updates & Safety Protocols",
        status: "Failed",
        duration: 0,
        cost: 0,
        workflowId: "workflow-002",
    },
    {
        id: "call-005",
        timestamp: "2024-01-17T08:10:00Z",
        managerName: "Sarah Johnson",
        calledAbout: "Weekly Performance Review & Team Development",
        status: "Completed",
        duration: 18,
        cost: 7.2,
        workflowId: "workflow-003",
    },
    {
        id: "call-006",
        timestamp: "2024-01-17T08:35:00Z",
        managerName: "Mike Chen",
        calledAbout: "Safety Protocol Update & Compliance Review",
        status: "Completed",
        duration: 10,
        cost: 4.0,
        workflowId: "workflow-003",
    },
    {
        id: "call-007",
        timestamp: "2024-01-18T08:05:00Z",
        managerName: "Sarah Johnson",
        calledAbout: "Customer Feedback Analysis & Service Improvements",
        status: "Completed",
        duration: 14,
        cost: 5.6,
        workflowId: "workflow-004",
    },
    {
        id: "call-008",
        timestamp: "2024-01-18T08:25:00Z",
        managerName: "Mike Chen",
        calledAbout: "Infrastructure Assessment & Upgrade Planning",
        status: "Completed",
        duration: 11,
        cost: 4.4,
        workflowId: "workflow-004",
    },
    {
        id: "call-009",
        timestamp: "2024-01-19T08:08:00Z",
        managerName: "Sarah Johnson",
        calledAbout: "End-of-Week Summary & Weekend Preparations",
        status: "Completed",
        duration: 13,
        cost: 5.2,
        workflowId: "workflow-005",
    },
    {
        id: "call-010",
        timestamp: "2024-01-19T08:32:00Z",
        managerName: "Mike Chen",
        calledAbout: "Weekend Security Protocols & Emergency Procedures",
        status: "Partial",
        duration: 6,
        cost: 2.4,
        workflowId: "workflow-005",
    },
]

export const transcriptions: Transcription[] = [
    {
        id: "trans-001",
        callId: "call-001",
        timestamp: "2024-01-15T08:15:00Z",
        fullText:
            "Good morning Sarah, this is the Zorah AI system calling for your daily operations update. Can you please provide me with the current status of your department including staffing levels, equipment status, and any notable incidents from the previous shift? Thank you. Hi there, yes of course. Everything is running very smoothly today. We have full staffing with all 24 team members present and accounted for. No one called in sick today which is great. All our primary equipment is operational - the main production line is running at 98% efficiency, which is above our target of 95%. We had a minor calibration issue with Unit 2 yesterday evening, but our night shift technician resolved it completely. Customer satisfaction scores from yesterday's feedback are sitting at 96%, which is excellent. We had no safety incidents overnight, and our quality control metrics are all within acceptable ranges. The team morale seems very high today, and we're on track to exceed our daily production targets by about 8%. Is there anything specific you need me to address or elaborate on? No, that covers everything we need for today's report Sarah. Thank you for the comprehensive update and keep up the excellent work. Have a productive day.",
    },
    {
        id: "trans-002",
        callId: "call-002",
        timestamp: "2024-01-15T08:30:00Z",
        fullText:
            "Hello Mike, this is Zorah AI calling for your equipment status report and maintenance schedule update. Can you provide the current operational status of all critical systems and any maintenance activities completed or scheduled? Hi Zorah. All critical systems are green across the board today. We successfully completed the scheduled preventive maintenance on Unit 3 last night between 11 PM and 3 AM as planned. The system is back online and running at full capacity with improved efficiency metrics. Our HVAC system is operating within normal parameters - temperature control is stable throughout all zones. The backup power systems were tested this morning and are fully operational. We have two minor maintenance items scheduled for this weekend: replacing the filters in the air handling unit and updating the software on the monitoring system. Both are routine and shouldn't impact operations. All safety systems including fire suppression, emergency lighting, and security systems were tested and are functioning perfectly. The predictive maintenance algorithms are showing no red flags for the next 30 days. Is there anything else you need regarding equipment status? That's perfect Mike. Thank you for the thorough update and excellent maintenance work.",
    },
    {
        id: "trans-003",
        callId: "call-003",
        timestamp: "2024-01-16T08:12:00Z",
        fullText:
            "Good morning Sarah, Zorah AI here for your daily update. How are operations running today, and do you have any staffing or resource challenges to report? Morning Zorah. We do have a bit of a staffing situation today that I'm managing. Two of our key team members called in sick with what appears to be a flu bug that's going around. Additionally, one of our supervisors had a family emergency and needed to leave early yesterday, so she won't be in until this afternoon. However, I've been proactive about this. I've redistributed the workload across the remaining team members, and I've called in two part-time employees who were available to help cover the gaps. We're currently running at about 85% of our normal staffing level, which means we might be about 10-12% behind our usual pace today. But I want to emphasize that we're not compromising on quality - I'd rather maintain our high standards and deliver slightly less than rush and risk errors. I've also reached out to our temporary staffing agency and have arranged for additional coverage tomorrow and Friday if the sick employees aren't back. The team that is here is really stepping up and showing great teamwork. Customer service levels are still strong, and we haven't had any complaints. Is there anything specific you'd like me to focus on given the staffing constraints? You're handling this very well Sarah. Continue prioritizing quality over quantity, and keep me updated if the situation changes. Thank you for the proactive management.",
    },
    {
        id: "trans-005",
        callId: "call-005",
        timestamp: "2024-01-17T08:10:00Z",
        fullText:
            "Hello Sarah, this is Zorah AI calling for your weekly performance review and team development update. Can you share the key metrics, achievements, and any development initiatives from this week? Hi Zorah! This has been an absolutely outstanding week for our department. Let me break down the key performance indicators for you. First, productivity metrics: we exceeded our weekly targets by 15%, which is the best performance we've had in the last quarter. Our efficiency rating averaged 97.2% across all production lines, well above our target of 95%. Quality metrics are equally impressive - we maintained a 99.1% quality score with only 0.9% defect rate, which is actually a new record for us. Customer satisfaction surveys came back with an average score of 94.3%, and we received several written compliments from clients specifically praising our responsiveness and attention to detail. From a safety perspective, we had zero incidents this week, zero near-misses, and 100% compliance with all safety protocols. The team completed 98% of their mandatory safety training modules ahead of schedule. On the development front, we successfully implemented the new process improvement system that we've been piloting. It's already showing measurable results in reducing waste and improving workflow efficiency. Three of our team members completed their professional certification courses this week, and two others are enrolled in leadership development programs. Team morale surveys show a 92% satisfaction rate, which is up 8% from last month. We also successfully completed the quarterly cross-training initiative, which means we now have better coverage and flexibility across all roles. Is there anything specific about our performance or development initiatives you'd like me to elaborate on? Excellent work Sarah. These results are truly impressive and reflect outstanding leadership and team performance. Keep up the exceptional work.",
    },
    {
        id: "trans-006",
        callId: "call-006",
        timestamp: "2024-01-17T08:35:00Z",
        fullText:
            "Hi Mike, Zorah AI here for your safety protocol update and compliance review. Can you provide the current status of all safety systems, training completion rates, and any incidents or improvements implemented? Hello Zorah! I'm pleased to report that all safety protocols are being followed meticulously and we're seeing excellent compliance across all areas. Let me give you a comprehensive update. First, our safety systems status: all fire suppression systems were tested Monday and are functioning perfectly. Emergency lighting systems are operational with backup batteries at full charge. All safety equipment including first aid stations, emergency eyewash stations, and safety showers have been inspected and restocked as needed. The emergency evacuation routes are clear and properly marked. Regarding training and compliance: we completed our monthly comprehensive safety drill yesterday with 100% participation from all staff members. The drill included fire evacuation, chemical spill response, and medical emergency procedures. Average evacuation time was 3 minutes and 45 seconds, which beats our target of 4 minutes. Our new safety training modules that we rolled out last month have achieved a 95% completion rate across all departments. The remaining 5% are scheduled to complete their training by Friday. We've had zero safety incidents this week, zero near-misses reported, and zero OSHA recordable events. Our safety suggestion box received three new ideas from employees this week, which I'm currently evaluating for implementation. One particularly good suggestion about improving visibility in the warehouse area is already being implemented. We also updated our Material Safety Data Sheets for all chemicals and ensured all employees have access to the latest versions. Personal protective equipment compliance is at 100%, and all equipment is in good condition. Is there anything specific about our safety protocols or compliance that you'd like me to address further? Outstanding work Mike. Your commitment to maintaining the highest safety standards is exemplary and greatly appreciated.",
    },
    {
        id: "trans-007",
        callId: "call-007",
        timestamp: "2024-01-18T08:05:00Z",
        fullText:
            "Good morning Sarah, Zorah AI calling for your customer feedback analysis and service improvement update. Can you share insights from recent customer interactions and any service enhancement initiatives? Good morning! I have some really positive customer feedback data to share with you today. We've been systematically analyzing all customer touchpoints and the results are very encouraging. From our customer satisfaction surveys this week, we received 47 responses with an average rating of 4.7 out of 5. The most frequently mentioned positive aspects were our responsiveness, attention to detail, and proactive communication. Specifically, customers highlighted that we often anticipate their needs before they have to ask, which shows our team is really understanding their business requirements. We did receive some constructive feedback as well. Three customers mentioned that our initial response time for non-urgent requests could be improved. Currently, we're averaging 4 hours for non-urgent responses, and they'd prefer to see that closer to 2-3 hours. I've already discussed this with the team and we're implementing a new triage system to better prioritize and respond to requests. Another area for improvement that came up is our reporting format. Some customers would like more visual dashboards rather than text-heavy reports. I'm working with our IT team to develop more graphical reporting templates that will be easier to digest. On the positive side, we've implemented two major service improvements this week based on previous feedback. First, we now send proactive status updates every 2 hours during active projects, which customers love. Second, we've created a dedicated customer portal where they can track their requests in real-time. Early adoption is at 78% and feedback is very positive. We also started a customer advisory panel with five of our key clients to get regular input on service improvements. The first meeting is scheduled for next week. Is there anything specific about customer feedback or service improvements you'd like me to focus on? Excellent customer-focused approach Sarah. The proactive improvements and systematic feedback analysis are exactly what we need to maintain our competitive edge.",
    },
    {
        id: "trans-008",
        callId: "call-008",
        timestamp: "2024-01-18T08:25:00Z",
        fullText:
            "Hello Mike, this is Zorah AI calling for your infrastructure assessment and upgrade planning update. Can you provide the current status of our systems and any planned improvements or upgrades? Hi Zorah. I've completed a comprehensive infrastructure assessment this week and have some important updates and recommendations. Let me start with our current system status. All core infrastructure is performing well, but we're approaching some capacity limits that we need to address proactively. Our network infrastructure is currently running at 78% capacity during peak hours, which is getting close to our 80% threshold for planning upgrades. Internet bandwidth utilization peaks at 85% during our busiest periods, so we should consider upgrading our connection in the next quarter. The server infrastructure is solid - our main servers are running at 65% capacity with good performance metrics. However, our backup systems are older and I recommend we upgrade them within the next six months to ensure reliability. Storage capacity is at 72% across all systems, so we're in good shape there for the next year. For planned upgrades, I've identified several priority items. First, we need to upgrade our firewall and security systems - the current ones are three years old and newer threats require more advanced protection. Second, our wireless network infrastructure needs expansion to better cover the new areas of the facility. Third, I recommend we implement a redundant internet connection for better reliability. The estimated timeline for these upgrades would be: security systems next month, network expansion in March, and redundant internet by April. Total budget estimate is approximately $45,000 for all improvements. I've also been researching cloud migration options for some of our less critical systems, which could reduce our on-premise infrastructure requirements and provide better scalability. Would you like me to prepare a detailed proposal for any of these infrastructure improvements? Yes, please prepare detailed proposals for the security and network upgrades as priority items. Excellent assessment Mike.",
    },
    {
        id: "trans-009",
        callId: "call-009",
        timestamp: "2024-01-19T08:08:00Z",
        fullText:
            "Good morning Sarah, Zorah AI here for your end-of-week summary and weekend preparation update. Can you provide a comprehensive overview of the week's performance and weekend readiness? Good morning Zorah! What a fantastic week it's been. Let me give you a complete summary of our performance and weekend preparations. This week's overall performance has been exceptional across all key metrics. We achieved 112% of our weekly production targets, which is outstanding. Quality scores averaged 98.7% throughout the week, with only minor issues that were quickly resolved. Customer satisfaction remained consistently high at 94.8% average, and we received zero complaints and several compliments. Our team really came together this week. Despite the staffing challenges we had on Tuesday, everyone stepped up and we actually ended the week ahead of schedule. Staff morale is at an all-time high - our weekly team survey showed 96% job satisfaction, and several employees mentioned feeling proud of their contributions. From an operational standpoint, we completed all scheduled maintenance, finished the quarterly inventory audit ahead of deadline, and successfully implemented two process improvements that are already showing positive results. We also exceeded our cost-saving targets by 8% through efficiency improvements. For weekend preparations, everything is set up perfectly. The weekend skeleton crew of 6 people is fully briefed and prepared. All critical systems are running smoothly and don't require any special attention. We've prepared detailed handover notes for the weekend supervisor, including contact information for any escalations. Security protocols are in place, and all weekend safety procedures have been reviewed with the team. The facility is clean, organized, and ready for Monday's full operations. We have contingency plans in place for any potential issues, and I'll be available by phone if needed. Looking ahead to next week, we have three new client onboardings scheduled and a team training session on Wednesday. Everything is prepared and we're ready to maintain this excellent momentum. Is there anything specific about our weekend preparations or next week's planning you'd like me to address? Excellent week Sarah, and thorough weekend preparation. Your team's performance and your leadership continue to be exemplary.",
    },
    {
        id: "trans-010",
        callId: "call-010",
        timestamp: "2024-01-19T08:32:00Z",
        fullText:
            "Hi Mike, Zorah AI calling for your weekend security protocols and emergency procedures update. Can you confirm all systems are ready and provide the emergency contact procedures? Hi Zorah. I've completed all weekend security preparations and emergency procedure reviews. Let me walk you through everything. All security systems are fully operational and have been tested this morning. The main security panel shows all zones are secure, cameras are recording properly, and motion detectors are functioning correctly. Access control systems are working perfectly - weekend staff have their access cards programmed and tested. The perimeter security including gates and fencing has been inspected and is secure. For emergency procedures, I've reviewed all protocols with the weekend security team. They have the complete emergency contact list including local police, fire department, medical services, and our key personnel. The emergency communication system has been tested and is working properly. All emergency equipment including fire extinguishers, first aid kits, and emergency lighting has been checked and is ready. However, I do need to mention one concern. During my final security system check, I noticed that one of the backup communication lines is showing intermittent connectivity issues. It's not critical since our primary systems are working fine, but I wanted to flag it for attention on Monday. The issue doesn't compromise our weekend security, but we should have our telecom vendor look at it early next week. I've documented the issue and left detailed notes for follow-up. The weekend security supervisor has been fully briefed on all procedures, has all necessary contact information, and knows to call me immediately if any issues arise. All security protocols are in place and the facility is secure for the weekend. Is there anything else you need regarding weekend security or emergency preparedness? Thank you for the thorough preparation Mike. Please ensure the communication line issue is prioritized for Monday morning, but otherwise everything sounds well-prepared for the weekend.",
    },
]

export const summaries: Summary[] = [
    {
        id: "summary-001",
        callId: "call-001",
        summaryText:
            "Sarah Johnson reports exceptional daily operations with full staffing (24/24 present), 98% production efficiency exceeding 95% target, 96% customer satisfaction, zero safety incidents, and team on track to exceed daily targets by 8%. All equipment operational with minor Unit 2 calibration issue resolved by night shift.",
    },
    {
        id: "summary-002",
        callId: "call-002",
        summaryText:
            "Mike Chen confirms all critical systems operational. Completed scheduled Unit 3 maintenance (11PM-3AM) with improved efficiency. HVAC stable, backup power tested and operational. Weekend maintenance scheduled: air filter replacement and monitoring system software update. All safety systems tested and functioning perfectly.",
    },
    {
        id: "summary-003",
        callId: "call-003",
        summaryText:
            "Sarah Johnson managing staffing shortage (2 sick, 1 early departure) with proactive measures: workload redistribution, part-time staff called in, temporary agency arranged for coverage. Operating at 85% staffing, 10-12% behind pace but maintaining quality standards. Team showing excellent cooperation.",
    },
    {
        id: "summary-005",
        callId: "call-005",
        summaryText:
            "Sarah Johnson reports outstanding weekly performance: 15% above productivity targets, 97.2% efficiency average, 99.1% quality score (new record), 94.3% customer satisfaction, zero safety incidents. Successfully implemented new process improvement system, completed quarterly cross-training, 92% team morale satisfaction (+8% from last month).",
    },
    {
        id: "summary-006",
        callId: "call-006",
        summaryText:
            "Mike Chen reports excellent safety compliance: monthly drill completed with 100% participation (3:45 evacuation time, beating 4-minute target), 95% training completion rate, zero incidents/near-misses. All safety systems tested and operational, three employee safety suggestions received, PPE compliance at 100%.",
    },
    {
        id: "summary-007",
        callId: "call-007",
        summaryText:
            "Sarah Johnson reports strong customer feedback analysis: 4.7/5 average satisfaction from 47 responses, customers praise responsiveness and proactive communication. Identified improvement areas: reduce non-urgent response time from 4 to 2-3 hours, implement visual dashboards. New initiatives: 2-hour project updates, customer portal (78% adoption), customer advisory panel scheduled.",
    },
    {
        id: "summary-008",
        callId: "call-008",
        summaryText:
            "Mike Chen completed comprehensive infrastructure assessment: network at 78% capacity (approaching 80% threshold), bandwidth peaks at 85%, servers at 65% capacity. Priority upgrades needed: security systems (next month), network expansion (March), redundant internet (April). Total budget estimate $45,000. Backup systems require upgrade within 6 months.",
    },
    {
        id: "summary-009",
        callId: "call-009",
        summaryText:
            "Sarah Johnson reports exceptional week: 112% of production targets achieved, 98.7% quality average, 94.8% customer satisfaction, zero complaints. Team morale at 96% satisfaction. Weekend preparations complete: 6-person skeleton crew briefed, all systems ready, contingency plans in place. Three new client onboardings scheduled for next week.",
    },
    {
        id: "summary-010",
        callId: "call-010",
        summaryText:
            "Mike Chen confirms weekend security readiness: all systems operational and tested, weekend staff access configured, emergency procedures reviewed with security team. One non-critical issue identified: intermittent backup communication line connectivity (flagged for Monday follow-up). Facility secure and ready for weekend operations.",
    },
]

export const workflows: Workflow[] = [
    {
        id: "workflow-001",
        date: "2024-01-15",
        status: "Success",
        summary:
            "Exceptional start to the week with both departments reporting optimal performance. Sarah's team achieved 98% production efficiency with full staffing and high customer satisfaction. Mike completed critical maintenance successfully with all systems operational. Strong foundation set for continued excellence.",
        totalCost: 8.0,
        manager: "Sarah Johnson, Mike Chen",
        callIds: ["call-001", "call-002"],
    },
    {
        id: "workflow-002",
        date: "2024-01-16",
        status: "Partial",
        summary:
            "Mixed results with effective crisis management demonstrated. Sarah proactively handled staffing challenges while maintaining quality standards, showing excellent leadership under pressure. Unable to reach Mike for critical maintenance update, requiring follow-up to ensure system reliability.",
        totalCost: 6.0,
        manager: "Sarah Johnson, Mike Chen",
        callIds: ["call-003", "call-004"],
    },
    {
        id: "workflow-003",
        date: "2024-01-17",
        status: "Success",
        summary:
            "Outstanding mid-week performance across all metrics. Sarah's team delivered record-breaking results with 15% above targets and exceptional quality scores. Mike maintained perfect safety compliance with comprehensive training completion. Both departments demonstrating peak operational excellence.",
        totalCost: 11.2,
        manager: "Sarah Johnson, Mike Chen",
        callIds: ["call-005", "call-006"],
    },
    {
        id: "workflow-004",
        date: "2024-01-18",
        status: "Success",
        summary:
            "Strong customer focus and infrastructure planning evident. Sarah's customer feedback analysis revealed high satisfaction with proactive service improvements implemented. Mike's comprehensive infrastructure assessment identified strategic upgrade priorities with detailed implementation timeline and budget planning.",
        totalCost: 10.0,
        manager: "Sarah Johnson, Mike Chen",
        callIds: ["call-007", "call-008"],
    },
    {
        id: "workflow-005",
        date: "2024-01-19",
        status: "Partial",
        summary:
            "Excellent week conclusion with comprehensive weekend preparations. Sarah delivered exceptional weekly performance summary showing 112% target achievement and thorough weekend readiness. Mike identified minor communication system issue requiring Monday attention but confirmed overall security preparedness.",
        totalCost: 7.6,
        manager: "Sarah Johnson, Mike Chen",
        callIds: ["call-009", "call-010"],
    },
]

export const usage: Usage = {
    billingMonth: "January 2024",
    totalUsage: 117, // total minutes
    totalCost: 42.8,
    workflowBreakdown: [
        {
            workflowId: "workflow-001",
            date: "2024-01-15",
            manager: "Sarah Johnson, Mike Chen",
            callCount: 2,
            duration: 20,
            cost: 8.0,
        },
        {
            workflowId: "workflow-002",
            date: "2024-01-16",
            manager: "Sarah Johnson, Mike Chen",
            callCount: 2,
            duration: 15,
            cost: 6.0,
        },
        {
            workflowId: "workflow-003",
            date: "2024-01-17",
            manager: "Sarah Johnson, Mike Chen",
            callCount: 2,
            duration: 28,
            cost: 11.2,
        },
        {
            workflowId: "workflow-004",
            date: "2024-01-18",
            manager: "Sarah Johnson, Mike Chen",
            callCount: 2,
            duration: 25,
            cost: 10.0,
        },
        {
            workflowId: "workflow-005",
            date: "2024-01-19",
            manager: "Sarah Johnson, Mike Chen",
            callCount: 2,
            duration: 19,
            cost: 7.6,
        },
    ],
}

// Helper functions
export function getCallById(id: string): Call | undefined {
    return calls.find((call) => call.id === id)
}

export function getTranscriptionByCallId(callId: string): Transcription | undefined {
    return transcriptions.find((trans) => trans.callId === callId)
}

export function getSummaryByCallId(callId: string): Summary | undefined {
    return summaries.find((summary) => summary.callId === callId)
}

export function getWorkflowById(id: string): Workflow | undefined {
    return workflows.find((workflow) => workflow.id === id)
}

export function getCallsByWorkflowId(workflowId: string): Call[] {
    return calls.filter((call) => call.workflowId === workflowId)
}

export function getWorkflowIndex(workflowId: string): number {
    const index = workflows.findIndex((workflow) => workflow.id === workflowId)
    return index + 1
}
