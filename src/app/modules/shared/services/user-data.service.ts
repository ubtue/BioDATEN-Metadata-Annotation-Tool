import { MetadataStatus } from './../models/metadata-status.model';
import { HttpHeaders } from '@angular/common/http';
import { MetadataUserResource } from './../models/metadata-user-resource.model';
import { SettingsService } from 'src/app/modules/shared/services/settings.service';
import { DataTransferService } from './../../core/services/data-transfer.service';
import { MetadataUserResourceServerResponse } from './../models/metadata-user-resource-server-response.model';
import { Injectable } from '@angular/core';



@Injectable({
	providedIn: 'root',
})
export class UserResourceService {

	public readonly NO_TITLE_SET:string = 'No title set (datacite)';

	/**
	 * constructor
	 */
	constructor(private dataTransferService: DataTransferService,
				private settingsService: SettingsService) {
	}


	/**
	 * getAllUserResourcesFromServer
	 *
	 * Gets all user resources from the server
	 *
	 * @returns
	 */
	getAllUserResourcesFromServer(userId: string): Promise<MetadataUserResourceServerResponse[]> {

		// Get the user resources from the server
		return this.dataTransferService.getData(this.settingsService.userResourceServerAddress + '/user_id/' + userId).then(

			(result: MetadataUserResourceServerResponse[]) => {
				return result;
			}
		);
	}


	/**
	 * updateUserResource
	 *
	 * Updates the user resource
	 *
	 * @param userId
	 * @param xmlData
	 * @returns
	 */
	updateUserResource(metsId: string, userId: string, xmlData: string, status: string): Promise<any> {

		// Create params string
		let params = {
			'metsId': metsId,
			'userId': userId,
			'hpc_job_id': 0,
			'metadata_status': status,
			'mets_xml': xmlData,
			'lastmodified': Date.now()
		};

		let paramsString = JSON.stringify(params);

		// Create httpOpts (headers)
		let httpOpts = {
			headers: new HttpHeaders().set('Accept', '*/*').set('Content-Type', 'application/json')
		};

		// Send POST-Request
		return this.dataTransferService.putData(this.settingsService.userResourceServerAddress, paramsString, httpOpts);
	}


	/**
	 * parseUserResourcesServerResponseToUserResources
	 *
	 * Parses the user resource server response to a local format
	 *
	 * @param metadataResourcesServerResponse
	 * @returns
	 */
	parseUserResourcesServerResponseToUserResources(metadataResourcesServerResponse: MetadataUserResourceServerResponse[]): MetadataUserResource[] {

		let result: MetadataUserResource[] = [];

		// Check if data has entries
		if ( metadataResourcesServerResponse && metadataResourcesServerResponse.length > 0 ) {

			let position = 1;

			// Loop through the data and parse every entry
			for ( let i = 0; i < metadataResourcesServerResponse.length; i++ ) {

				let currentServerResource = metadataResourcesServerResponse[i];

				// Convert the date
				let date = new Date(currentServerResource.lastmodified);

				// Convert the date so it has leading 0
				// https://stackoverflow.com/a/3605248
				let lastChange  = date.getFullYear() + '-'
								+ ('0' + (date.getMonth()+1)).slice(-2) + '-'
								+ ('0' + date.getDate()).slice(-2)
								+ ' '
								+ ('0' + date.getHours()).slice(-2)
								+ ':'
								+ ('0' + date.getMinutes()).slice(-2);

				// Status
				let metadataStatus = this.parseStatus(currentServerResource.metadata_status);

				// Get the title from the mets_xml (datacite)
				let title = this.parseTitleFromMetsXML(currentServerResource.mets_xml);

				// Add new Resource to the result
				let metadataUserResource = new MetadataUserResource(
					position,
					currentServerResource.metsId,
					title,
					lastChange,
					metadataStatus.status,
					metadataStatus.statusKey,
					currentServerResource.mets_xml
				);

				result.push(metadataUserResource);

				// Count the position up
				position++;
			}
		}

		return result;
	}


	/**
	 * parseTitleFromMetsXML
	 *
	 * Extracts the title from a mets_xml string
	 *
	 * @param xml
	 * @returns
	 */
	parseTitleFromMetsXML(xml: string): string {

		let title: string = '';

		// Search for a title node
		const regex = /<title>(.+?)<\/title>/gm;

		// Get the content of the node
		let result = regex.exec(xml);

		if ( result && result.length > 1 ) {
			title = result[1];
		} else {

			title = this.NO_TITLE_SET;
		}

		return title;
	}

	/**
	 * parseStatus
	 *
	 * Parses the metadata status string to a MetadataStatus object
	 *
	 * @param statusString
	 * @returns
	 */
	parseStatus(statusString: string): MetadataStatus {

		let metadataStatus: MetadataStatus = {
			status: '',
			statusKey: ''
		};

		switch ( statusString ) {

			case 'created':
				metadataStatus.status = 'new';
				metadataStatus.statusKey = 'a_new';
				break;

			case 'progress':
				metadataStatus.status = 'In progress';
				metadataStatus.statusKey = 'k_progress';
				break;

			case 'finished':
				metadataStatus.status = 'Finished';
				metadataStatus.statusKey = 't_finished';
				break;

			case 'pub':
				metadataStatus.status = 'Published';
				metadataStatus.statusKey = 'z_pub';
				break;
		}

		return metadataStatus;
	}


	/**
	 * getUserResourceStatus
	 *
	 * Gets the current status of the user resource from the server
	 *
	 * @param metsId
	 * @returns
	 */
	getUserResourceStatus(metsId: string): Promise<MetadataStatus> {

		// Get the user resources status from the server
		return this.dataTransferService.getData(this.settingsService.userResourceServerAddress + '/status/' + metsId).then(

			(result: string) => {
				return this.parseStatus(result);
			}
		);
	}


	/**
	 * createDummyData
	 *
	 * Writes empty dummy data to the database
	 *
	 * @param userId
	 * @returns
	 */
	createDummyData(userId: string): Promise<any> {

		// Create params string
		let params = {
			'userId': userId,
			'hpc_job_id': 0,
			'metadata_status': 'created',
			'mets_xml': this.getDummyXMLString(),
			'created': Date.now(),
			'lastmodified': Date.now()
		};

		let paramsString = JSON.stringify(params);

		// Create httpOpts (headers)
		let httpOpts = {
			headers: new HttpHeaders().set('Accept', '*/*').set('Content-Type', 'application/json')
		};

		// Send POST-Request
		return this.dataTransferService.postData(this.settingsService.userResourceServerAddress, paramsString, httpOpts);
	}


	/**
	 * getDummyXMLString
	 *
	 * Returns an empty dummy structure
	 *
	 * @returns
	 */
	private getDummyXMLString(): string {
		return '<?xml version="1.0"?><schemas><newSchema schema="datacite"><resource xmlns="http://datacite.org/schema/kernel-4"><identifier></identifier><creators><creator><creatorName></creatorName></creator></creators><titles><title></title></titles><publisher></publisher><publicationYear></publicationYear><resourceType></resourceType><contributors><contributor><contributorName></contributorName></contributor></contributors><fundingReferences><fundingReference><funderName></funderName><funderIdentifier></funderIdentifier></fundingReference></fundingReferences><relatedItems><relatedItem><number></number></relatedItem></relatedItems></resource></newSchema><newSchema schema="BiodatenMinimal"><cmdp:BiodatenMinimal xmlns:cmdp="http://www.clarin.eu/cmd/1/profiles/clarin.eu:cr1:p_1610707853515" xmlns="http://www.clarin.eu/cmd/1"><cmdp:Study><cmdp:typeOfStudy></cmdp:typeOfStudy><cmdp:RunID></cmdp:RunID><cmdp:biologicalBackground></cmdp:biologicalBackground></cmdp:Study><cmdp:Experiment><cmdp:typeOfMethod></cmdp:typeOfMethod><cmdp:method></cmdp:method><cmdp:isolationMethod></cmdp:isolationMethod><cmdp:proteinAnalysisMethod></cmdp:proteinAnalysisMethod><cmdp:particleAnalysisMethod></cmdp:particleAnalysisMethod><cmdp:SequencingAnalysisType><cmdp:metagenomics><cmdp:assembly_qual></cmdp:assembly_qual><cmdp:assembly_name></cmdp:assembly_name><cmdp:assembly_software></cmdp:assembly_software><cmdp:annot></cmdp:annot><cmdp:number_contig></cmdp:number_contig><cmdp:feat_pred></cmdp:feat_pred><cmdp:ref_db></cmdp:ref_db><cmdp:sim_search_method></cmdp:sim_search_method><cmdp:Seq_16s_recover></cmdp:Seq_16s_recover><cmdp:Seq_16s_recover_software></cmdp:Seq_16s_recover_software><cmdp:trnas></cmdp:trnas><cmdp:trna_ext_software></cmdp:trna_ext_software><cmdp:compl_score></cmdp:compl_score><cmdp:compl_software></cmdp:compl_software><cmdp:compl_appr></cmdp:compl_appr><cmdp:contam_score></cmdp:contam_score><cmdp:contam_screen_input></cmdp:contam_screen_input><cmdp:contam_screen_param></cmdp:contam_screen_param><cmdp:decontam_software></cmdp:decontam_software><cmdp:bin_param></cmdp:bin_param><cmdp:bin_software></cmdp:bin_software><cmdp:reassembly_bin></cmdp:reassembly_bin><cmdp:mag_cov_software></cmdp:mag_cov_software></cmdp:metagenomics><cmdp:amplicon_sequencing><cmdp:nucl_acid_amp></cmdp:nucl_acid_amp><cmdp:target_gene></cmdp:target_gene><cmdp:target_subfragment></cmdp:target_subfragment><cmdp:pcr_primers></cmdp:pcr_primers><cmdp:adapters></cmdp:adapters><cmdp:pcr_cond></cmdp:pcr_cond><cmdp:chimera_check></cmdp:chimera_check></cmdp:amplicon_sequencing></cmdp:SequencingAnalysisType></cmdp:Experiment><cmdp:Sample><cmdp:organism></cmdp:organism><cmdp:specimenTissueType></cmdp:specimenTissueType><cmdp:cellType></cmdp:cellType><cmdp:environmentID></cmdp:environmentID><cmdp:sampleBackground></cmdp:sampleBackground></cmdp:Sample><cmdp:Environment><cmdp:environmentalPackage></cmdp:environmentalPackage></cmdp:Environment><cmdp:Run><cmdp:sampleID_or_dataId></cmdp:sampleID_or_dataId><cmdp:dataID></cmdp:dataID><cmdp:experimentID></cmdp:experimentID><cmdp:runBackground></cmdp:runBackground></cmdp:Run><cmdp:Data><cmdp:dataReference></cmdp:dataReference></cmdp:Data></cmdp:BiodatenMinimal></newSchema><newSchema schema="premis"><premis version="3.0" xmlns="http://www.loc.gov/premis/v3"><object></object><rights version="3.0"><rightsStatement><rightsStatementIdentifier><rightsStatementIdentifierType></rightsStatementIdentifierType><rightsStatementIdentifierValue></rightsStatementIdentifierValue></rightsStatementIdentifier><rightsBasis></rightsBasis></rightsStatement></rights></premis></newSchema></schemas>';
	}
}

