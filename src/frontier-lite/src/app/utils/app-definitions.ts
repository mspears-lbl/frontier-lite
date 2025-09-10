
export enum FrontierField {
    AssumedLifespanYears=1,
    DiscountRate=2,
    BenefitsNpv=3,
    AnnualAvoidedUtilityCostsYear=4,
    AnnualAvoidedCustomerCostsYear=5,
    AnnualAvoidedOtherCostsYear=6,
    CostsNpv=7,
    CapitalInvestment=8,
    AnnualOMCostsYear=9,
    AnnualFixedCostsYear=10,
    AnnualOtherCostsYear=11,
    BenefitCostRatio=12,
    SupplyChainInterdependencyIndex=13,
    CommunitySupportIndex=14,
    EnergyIndependenceIndex=15,
    SustainabilityIndex=16,
    CustomersAffected=17,
    OutageDuration=18,
    DistributionResidential=19,
    DistributionSmnr=20,
    DistributionLnr=21,
    DistributionPublic=22,
    ThreatFrequency=23,
    ChangeOutageLength=24,
    ChangeOutageLikelihood=25,
}

export const fieldDefinitions = [
    {id: FrontierField.CustomersAffected, name: `Customers Affected`, description: `The baseline customers affected.`},
    {id: FrontierField.OutageDuration, name: 'Outage Duration', description: `Outage Duration`},
    {id: FrontierField.DistributionResidential, name: 'Distribution Residential', description: `Distribution Residential`},
    {id: FrontierField.DistributionSmnr, name: 'Distribution Smnr', description: `Distribution Smnr`},
    {id: FrontierField.DistributionLnr, name: 'Distribution Lnr', description: `Distribution Lnr`},
    {id: FrontierField.DistributionPublic, name: 'Distribution Public', description: `Distribution Public`},
    {id: FrontierField.ThreatFrequency, name: 'Threat Frequency', description: `Threat Frequency`},
    {id: FrontierField.ChangeOutageLength, name: 'Change Outage Length', description: `Change Outage Length`},
    {id: FrontierField.ChangeOutageLikelihood, name: 'Change Outage Likelihood', description: `Change Outage Likelihood`},
    {id: FrontierField.AssumedLifespanYears, name: `Assumed Lifespan (years)`, description: `This is the assumed useful life of the resilience strategy. This also represents the timeframe over which the benefit-cost analysis is performed for a given strategy. For example, if the strategy of undergrounding transmission lines is estimated to have a lifespan of 20 years, then the costs and benefits of this strategy will be accrued over 20 years. `},
    {id: FrontierField.DiscountRate, name: `Discount Rate (%)`, description: `This assumed discount rate is used to determine the present value of future cash flows –future benefits and future costs are discounted by this percentage to arrive at a present value. `},
    {id: FrontierField.BenefitsNpv, name: `Benefits (NPV)`, description: `The net present value (NPV) of the benefits is calculated by summing the annual avoided utility costs, annual avoided customer costs, and other annual avoided costs for each year of the lifespan of the resilience strategy. Total benefits for each future year are then discounted back to present using the discount rate and summed to represent the net present value of all benefits.`},
    {id: FrontierField.AnnualAvoidedUtilityCostsYear, name: `Annual Avoided Utility Costs ($/year)`, description: `The annual avoided utility costs represent avoided operations and maintenance and/or capital costs associated with the resilience strategy. `},
    {id: FrontierField.AnnualAvoidedCustomerCostsYear, name: `Annual Avoided Customer Costs ($/year)`, description: `The annual avoided customer costs are annual customer power interruption costs that were avoided because of the resilience strategy. Avoided customer interruption costs are calculated using the following information: (1) a customer damage function that estimates costs of power interruptions of varying restoration times for the different customer classes; (2) the count of customers for each customer class (residential, small-medium non-residential, large non-residential, and public sector); and (3) the annual frequency and duration of power interruptions before and after the resilience strategy has been implemented.`},
    {id: FrontierField.AnnualAvoidedOtherCostsYear, name: `Annual Avoided Other Costs ($/year)`, description: `The annual avoided other costs include any additional costs that were avoided because of the resilience strategy. The default value is assumed to be $0 for each year of the lifespan of the resilience strategy.  `},
    {id: FrontierField.CostsNpv, name: `Costs (NPV)`, description: `The net present value (NPV) of the costs is calculated by summing the annual O&M costs, annual fixed costs, and annual other costs for each year of the lifespan of the resilience strategy. Total costs for each future year are then discounted back to present using the discount rate and summed with the capital investment cost to represent the net present value of all costs.`},
    {id: FrontierField.CapitalInvestment, name: `Capital Investment ($)`, description: `The capital investment is a one-time cost (e.g., equipment, labor) associated with designing and implementing the resilience strategy. `},
    {id: FrontierField.AnnualOMCostsYear, name: `Annual O&M Costs ($/year)`, description: `The annual operations & maintenance (O&M) costs are the assumed labor and equipment costs of maintaining the resilience strategy as well as operating costs, including any fuel costs. `},
    {id: FrontierField.AnnualFixedCostsYear, name: `Annual Fixed Costs ($/year)`, description: `The annual fixed costs include any non-variable costs associated with a resilience strategy. These could include the interest portion of loan payments associated with the resilience strategy investment, costs to maintain the connection from the distribution system to a customer’s meter, and corporate structure and public purpose programs (e.g., energy efficiency and distributed generation programs). The default value is assumed to be $0 for each year of the lifespan of the resilience strategy.  `},
    {id: FrontierField.AnnualOtherCostsYear, name: `Annual Other Costs ($/year)`, description: `The annual other costs include any additional costs not already accounted for in designing, implementing, maintaining, and operating the resilience strategy. The default value is assumed to be $0 for each year of the lifespan of the resilience strategy.  `},
    {id: FrontierField.BenefitCostRatio, name: `Benefit-Cost Ratio`, description: `The benefit-cost ratio is estimated by dividing the benefits (NPV) by the costs (NPV). `},
    {id: FrontierField.SupplyChainInterdependencyIndex, name: `Supply Chain Interdependency Index`, description: `The supply chain interdependency index is an indicator of how concentrated community lifeline supply chain nodes are in an area within a service territory. The values range from 1, which indicates an area does not contain any critical lifeline supply chain nodes, to 10, which indicates an area is highly concentrated with critical lifeline supply chain nodes. The supply chain interdependency index is estimated by using facility-level locational data to identify the geographic location of these facilities and then a Kriging interpolation is used to identify critical lifeline supply chain node hotspots. The 1-10 ranking is developed from the output of the Kriging analysis.`},
    {id: FrontierField.CommunitySupportIndex, name: `Community Support Index`, description: `The community support index provides a measure of community perceived importance for an area within a service territory. The information on community support is obtained from rate payer surveys and stakeholder interviews on the importance of critical lifeline services and resilience options. It is a supply chain interdependency index weighted by the perceived importance of services in an area. A value ranging from 1, which indicates no significant importance was noted for lifeline resources within an area to 10, which means a high number of responses noted importance of resources within an area. `},
    {id: FrontierField.EnergyIndependenceIndex, name: `Energy Independence Index`, description: `The energy independence index is a measure how a resilience option will affect the electric utility’s energy portfolio. It is a categorical index with values of ‘decreased, ‘neutral’, and ‘increased’. A ‘decreased’ index value indicates that the resilience option will make the electric utility more dependent on non-local sources of energy. A ‘neutral index value indicates that the resilience option will not affect how the electric utility source energy resources. An ‘increased’ value A index value indicates that the resilience option will make the electric utility more dependent on local sources of energy.`},
    {id: FrontierField.SustainabilityIndex, name: `Sustainability Index`, description: `The sustainability index measures the greenhouse gas (GHG) emissions reduction impact of a resilience option. It is a categorical index with values of ‘decreased, ‘neutral’, and ‘increased’. A ‘decreased’ index value indicates that the resilience option will increase the rate at which the electric utility emits GHGs. A ‘neutral index value indicates that the resilience option will not affect the rate at which the electric utility emits GHGs. An ‘increased’ index value indicates that the resilience option will decrease the rate at which the electric utility emits GHGs.`},
];

/** Retrieve the description for a given FrontierField. */
export function getFieldDescription(field: FrontierField): string {
    const results = fieldDefinitions.find(item => item.id === field);
    if (!results) {
        throw new Error(`Unknown field ${field}`);
    }
    return results.description;
}
